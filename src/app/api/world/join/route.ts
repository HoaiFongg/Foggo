import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, sessionId, nickname } = body;

    const supabase = await createClient();

    // 1. Tìm thế giới
    let query = supabase.from("game_sessions").select("*");
    if (token) {
      query = query.eq("join_token", token);
    } else if (sessionId) {
      query = query.eq("id", sessionId);
    } else {
      return NextResponse.json({ error: "Thiếu thông tin thế giới" }, { status: 400 });
    }

    const { data: session, error: sessionError } = await query.single();
    if (sessionError || !session) {
      return NextResponse.json({ error: "Không tìm thấy thế giới hoặc link đã hết hạn" }, { status: 404 });
    }

    // 2. Kiểm tra trạng thái thế giới
    if (session.status === "paused") {
      return NextResponse.json(
        { error: "Thế giới này đang được giáo viên tạm dừng một lát" },
        { status: 403 }
      );
    }
    if (session.status === "closed") {
      return NextResponse.json(
        { error: "Thế giới này đã kết thúc thời gian mở" },
        { status: 403 }
      );
    }

    // 3. Xác thực người chơi
    let {
      data: { user },
    } = await supabase.auth.getUser();

    let playerNickname = nickname?.trim();

    if (!user) {
      if (!session.allow_guests) {
        return NextResponse.json(
          { error: "Thế giới này yêu cầu đăng nhập tài khoản học sinh", requiresLogin: true },
          { status: 401 }
        );
      }
      if (!playerNickname) {
        return NextResponse.json(
          { error: "Vui lòng nhập tên tạm (nickname) để tham gia" },
          { status: 400 }
        );
      }
      // Khách đăng nhập ẩn danh
      const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
      if (anonError || !anonData.user) {
        return NextResponse.json({ error: "Không thể khởi tạo phiên khách" }, { status: 500 });
      }
      user = anonData.user;
    } else {
      // Người dùng đã có tài khoản
      if (!playerNickname) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name, username")
          .eq("id", user.id)
          .single();
        playerNickname = profile?.display_name || profile?.username || "Thám Hiểm";
      }
    }

    // 4. Kiểm tra hoặc tạo nhân vật trong session_players
    const { data: existingPlayer } = await supabase
      .from("session_players")
      .select("*")
      .eq("session_id", session.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingPlayer) {
      if (existingPlayer.banned) {
        return NextResponse.json(
          { error: "Bạn đã bị giáo viên khóa khỏi thế giới này" },
          { status: 403 }
        );
      }
      return NextResponse.json({
        success: true,
        sessionId: session.id,
        playerId: existingPlayer.id,
        isExisting: true,
      });
    }

    // Khởi tạo nhân vật mới với trạng thái sinh tồn
    const initialSurvivalState = {
      hp: 100,
      maxHp: 100,
      hunger: 100,
      day: 1,
      isNight: false,
      lanternLevel: 1,
      inventory: [
        { id: "item_wood", name: "Gỗ sồi", quantity: 5 },
        { id: "item_bread", name: "Bánh mì", quantity: 2 },
      ],
    };

    const adminClient = createAdminClient();
    const { data: newPlayer, error: createPlayerError } = await adminClient
      .from("session_players")
      .insert({
        session_id: session.id,
        user_id: user.id,
        nickname: playerNickname,
        score: 0,
        gold: 10, // 10 Xu ban đầu
        state: initialSurvivalState,
      })
      .select("id")
      .single();

    if (createPlayerError || !newPlayer) {
      return NextResponse.json(
        { error: createPlayerError?.message || "Không thể tạo nhân vật" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      playerId: newPlayer.id,
      isExisting: false,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Lỗi máy chủ" }, { status: 500 });
  }
}

