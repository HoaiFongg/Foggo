/**
 * BILINGUAL QUESTION TRANSLATION ENGINE FOR FOGGO
 * Provides instant, zero-latency English translations for all questions and question sets.
 */

export interface QuestionTranslation {
  prompt: string;
  options?: Record<string, string>;
  statements?: Record<string, string>;
  pairs?: Record<string, { left?: string; right?: string }>;
  dropdowns?: Record<string, string[]>;
  passage?: string;
}

export const QUESTION_TRANSLATIONS: Record<string, QuestionTranslation> = {
  "8fb79b5b-0906-4c24-b995-c6998099233e": {
    "prompt": "What changes can you make to on-screen text to make it easier to read for visually impaired readers? (CHOOSE 2)",
    "options": {
      "opt_1": "Font style (Font)",
      "opt_2": "Font size (Size)",
      "opt_3": "Font color (Color)",
      "opt_4": "Contrast"
    }
  },
  "b45ec775-0edf-44e5-951a-045fa17c211e": {
    "prompt": "If a user wants to send an instant message to a colleague, but the colleague's account status is Unavailable, which of the following is the best action to take?",
    "options": {
      "opt_1": "Email the colleague.",
      "opt_2": "Call the colleague on the phone.",
      "opt_3": "Wait until the colleague's account becomes available.",
      "opt_4": "Send the message anyway."
    }
  },
  "85386572-afa7-41fe-87bb-f4a734668e67": {
    "prompt": "Which factors are considered negative impacts of FOMO (Fear Of Missing Out)? (Choose 2)",
    "options": {
      "opt_1": "Finances",
      "opt_2": "Loneliness",
      "opt_3": "Depression",
      "opt_4": "Loss"
    }
  },
  "607348c7-90b9-4a2d-8f34-55e9ef02d5c7": {
    "prompt": "You are applying for a job in your chosen career field. A potential employer will view your online portfolio. What should you do to support your online career profile?",
    "options": {
      "opt_1": "Provide information about your salary history and expectations.",
      "opt_2": "Provide information about your personal activities to show work-life balance.",
      "opt_3": "Restrict access to your profile to maintain privacy.",
      "opt_4": "Update your profile regularly to showcase your skills."
    }
  },
  "379706c9-61b0-42ee-8616-412f5d431331": {
    "prompt": "Which two communication methods are asynchronous? (Choose 2)",
    "options": {
      "opt_1": "Participating in a video conference.",
      "opt_2": "Sending an email.",
      "opt_3": "Making a phone call.",
      "opt_4": "Sending a text message."
    }
  },
  "aef7ccdb-acf7-49df-a9a6-4cef9787bbd0": {
    "prompt": "For each statement regarding webcam security, select True or False.",
    "statements": {
      "s1": "People should cover their webcams when not in use.",
      "s2": "All webcams have a recording indicator light that cannot be disabled via software.",
      "s3": "Disabling the webcam in your computer settings completely protects you from unauthorized access."
    }
  },
  "66bc1909-d9f3-47f2-82a8-cbe506dd11e0": {
    "prompt": "For each statement regarding portable media security, select True or False.",
    "dropdowns": {
      "d1": [
        "True",
        "False"
      ],
      "d2": [
        "True",
        "False"
      ],
      "d3": [
        "True",
        "False"
      ]
    },
    "passage": "{D} You should disable Autorun and Autoplay for all removable media devices.<br> {D} You should store your personal and work files on separate devices and never plug personal devices into work computers or vice versa.<br> {D} If you find a portable storage device and do not know who owns it, plug it into your computer to search for owner details."
  },
  "09774a4b-2a59-42ad-b152-cbe9a07f4a74": {
    "prompt": "What are two universal design principles for computer hardware? (Choose 2)",
    "options": {
      "opt_1": "Equitable Use: The design is useful and marketable to people with diverse abilities.",
      "opt_2": "Tolerance for Error: Minimizes hazards and adverse consequences of accidental or unintended actions.",
      "opt_3": "Keep Costs Low: Use cheaper parts whenever possible to reduce manufacturing costs.",
      "opt_4": "IoT Integration: Always enforce online connectivity to enhance user experience."
    }
  },
  "1700cb80-d2a7-40a5-a6f4-6ff4b8044682": {
    "prompt": "A user attempts to encrypt a folder in Windows, but the encryption option is unavailable. What is the reason for this missing feature?",
    "options": {
      "opt_1": "The user has Windows 10 Home edition.",
      "opt_2": "The folder is formatted with NTFS.",
      "opt_3": "The hard drive is already encrypted.",
      "opt_4": "The folder is formatted with FAT32."
    }
  },
  "36732b95-d8c7-4d23-95e8-1e8e7872f038": {
    "prompt": "A user receives an urgent phone call while in a meeting. What is the best course of action if they must take the call?",
    "options": {
      "opt_1": "Move 100-200 feet away from other people.",
      "opt_2": "Answer the phone directly in the room.",
      "opt_3": "Leave the meeting room quietly.",
      "opt_4": "Move to a corner of the meeting room."
    }
  },
  "b910077e-cc5a-4d93-960d-e895c2e74639": {
    "prompt": "Which two options explain a centralized data storage system? (Choose 2)",
    "options": {
      "opt_1": "Document management systems and libraries such as SharePoint.",
      "opt_2": "A database tracking inventory, customer orders, and deliveries.",
      "opt_3": "Sharing your local computer hard drive with other colleagues.",
      "opt_4": "Saving files on a local USB flash drive."
    }
  },
  "4cf1fd9b-8b02-4c73-b02e-e52208e9459d": {
    "prompt": "You are an employee needing to communicate with your manager in the evening. Match each situation with the most appropriate communication method.",
    "pairs": {
      "p1": {
        "left": "Wait until lunchtime the next day to meet or talk privately",
        "right": "You want advice or guidance from your manager on a personal matter"
      },
      "p2": {
        "left": "Call or text the manager directly",
        "right": "You have a critical emergency that requires immediate reporting and fast response"
      },
      "p3": {
        "left": "Draft the report and schedule it to send at 9:00 AM the next morning",
        "right": "You need to send a routine report that is not urgent or critical"
      }
    }
  },
  "ace8f15b-eb2f-4cfe-b238-212776910bfc": {
    "prompt": "You are researching Artificial Intelligence (AI). Which sources should you consult? Choose Yes or No.",
    "dropdowns": {
      "d1": [
        "Yes",
        "No"
      ],
      "d2": [
        "Yes",
        "No"
      ],
      "d3": [
        "Yes",
        "No"
      ],
      "d4": [
        "Yes",
        "No"
      ]
    },
    "passage": "Teachers and mentors {D} <br> Classmates {D} <br> Search on public forums {D} <br> Search reputable academic websites on the Internet {D}"
  },
  "979f480f-df44-4495-a3b5-f81bdb34c4ba": {
    "prompt": "The content on your computer monitor is hard to see. Dark areas are too dark and bright areas are washed out. Which monitor setting should you adjust?",
    "options": {
      "opt_1": "Sharpness",
      "opt_2": "Input Source",
      "opt_3": "Contrast",
      "opt_4": "Brightness"
    }
  },
  "0dbf6126-693e-44b8-833b-e23fd6bcd5b0": {
    "prompt": "Your friend asks you to review their history PowerPoint presentation. The layout looks cluttered and disorganized. Which two visual consistency principles should you advise them to follow? (Choose two)",
    "options": {
      "opt_1": "Apply the identical layout to every single slide.",
      "opt_2": "Follow design principles of alignment and repetition.",
      "opt_3": "Use a different font and color on each slide.",
      "opt_4": "Maintain consistency across visual elements such as typography and color palettes."
    }
  },
  "bfde323e-1ade-418e-961d-8e7421eb5ec2": {
    "prompt": "Which statements are true regarding Restrict Editing in Microsoft Word? (Choose 2)",
    "options": {
      "opt_1": "Formatting can be restricted to specific approved styles.",
      "opt_2": "Editing can be limited to specific parts of the document.",
      "opt_3": "Restrictions apply universally to all users of the document.",
      "opt_4": "The entire document can be protected with a password."
    }
  },
  "d42f2e58-19f6-431c-8c83-e7c4dc8b2a40": {
    "prompt": "Which item in Outlook Calendar lasts all day by default?",
    "options": {
      "opt_1": "Special",
      "opt_2": "Appointment",
      "opt_3": "Meeting",
      "opt_4": "Event"
    }
  },
  "5d0f4982-d461-4a4a-8a4f-f82f354f791a": {
    "prompt": "How should a person's wrists be positioned when typing to avoid Carpal Tunnel Syndrome?",
    "options": {
      "opt_1": "Kept straight in a neutral position.",
      "opt_2": "Bent at a 45-degree angle.",
      "opt_3": "Resting flat on the desk.",
      "opt_4": "Resting on the keyboard."
    }
  },
  "70312c69-1b55-4407-adb9-ebc648202262": {
    "prompt": "You lead a diverse team and plan a remote video meeting to brainstorm a new project. You must uphold digital ethics. Which two actions should you take? (Choose 2)",
    "options": {
      "opt_1": "Offer one-on-one help to inexperienced members to familiarize them with controls prior to the meeting.",
      "opt_2": "Ensure focus by only discussing ideas from your own pre-selected list.",
      "opt_3": "Use features such as Raise Hand so every team member has an equal opportunity to contribute.",
      "opt_4": "Ask members with heavy accents to only type in chat."
    }
  },
  "e40b8589-bfc9-409b-af2d-678304de0b28": {
    "prompt": "When a Microsoft Word document is password-protected, which of the following applies to that file?",
    "options": {
      "opt_1": "The document is encrypted.",
      "opt_2": "The document is set to Read-Write mode.",
      "opt_3": "The document is marked Read-Only.",
      "opt_4": "The document is compressed."
    }
  },
  "f76ad9f3-ef67-4b3c-922f-3beae027b2af": {
    "prompt": "What are possible symptoms of Repetitive Strain Injury (RSI) caused by prolonged computer use?",
    "options": {
      "opt_1": "Numbness",
      "opt_2": "Itching",
      "opt_3": "Muscle weakness",
      "opt_4": "Muscle ache and pain"
    }
  },
  "9a74370f-96d6-47fc-af47-544bdd22c6bd": {
    "prompt": "You are writing a research paper and find a scientific study. For each factor, choose Yes if you must evaluate it for credibility, or No if you do not.",
    "statements": {
      "s1": "The popularity of the study.",
      "s2": "The organization funding the research.",
      "s3": "The peer-reviewed publisher releasing the study."
    }
  },
  "3926e3a7-8d1d-4f22-b2cf-1f666e2e5f17": {
    "prompt": "Which term best describes the interactive automated assistant widget appearing on this website?",
    "options": {
      "opt_1": "Popup",
      "opt_2": "Virtual agent",
      "opt_3": "Chatbot",
      "opt_4": "In-app messenger"
    }
  },
  "3161228a-9b83-4984-b89c-3c95821144df": {
    "prompt": "Which statements are true about Slide Transitions in PowerPoint? (Choose 2)",
    "options": {
      "opt_1": "Transitions can include sound effects.",
      "opt_2": "Only one transition type is permitted per presentation.",
      "opt_3": "Transitions play continuously while viewing a slide.",
      "opt_4": "The duration and speed of transitions can be customized."
    }
  },
  "6511c5c8-1c0b-4297-bbfb-6582ab06020e": {
    "prompt": "A student needs to reschedule an internship interview and sends the following email:\n'Dear Ms. Smith,\nI am busy during the interview hour, so we have to reschedule. HOPE THIS DOES NOT BOTHER YOU!!!!!\n\nThanks a lot!!!'\nWhich element demonstrates appropriate email etiquette?",
    "options": {
      "opt_1": "Grammar",
      "opt_2": "Salutation / Greeting ('Dear Ms. Smith,')",
      "opt_3": "Capitalization rules",
      "opt_4": "Punctuation"
    }
  },
  "38e621f6-3fb9-4b62-a223-970e67e2c599": {
    "prompt": "When searching for information on Search Engines, which element represents the core concepts of the user query?",
    "options": {
      "opt_1": "Scope",
      "opt_2": "Context",
      "opt_3": "Operators",
      "opt_4": "Keywords"
    }
  },
  "709d0a9d-e1f4-4cac-a1e4-6092d8848b7c": {
    "prompt": "A user meets someone online who creates a fake persona trying to build an intimate relationship. What threat is this?",
    "options": {
      "opt_1": "Baiting",
      "opt_2": "Catfishing",
      "opt_3": "Social engineering",
      "opt_4": "Phishing"
    }
  },
  "acc349f4-2dea-4858-a564-f986a0ad749e": {
    "prompt": "A marketing manager wants a ball graphic to bounce up and down on a slide. What should they add to the object?",
    "options": {
      "opt_1": "Timing",
      "opt_2": "Transition",
      "opt_3": "Custom effect",
      "opt_4": "Animation"
    }
  },
  "f515113d-4049-4f0a-aa48-689b1b8e0233": {
    "prompt": "You use social media accounts for personal and professional purposes. Which two items are suitable to post on your professional account? (Choose 2)",
    "options": {
      "opt_1": "Complaints regarding your current colleagues.",
      "opt_2": "Your professional headshot photo.",
      "opt_3": "Professional technical certifications you earned.",
      "opt_4": "Photos of family game nights."
    }
  },
  "7fddfd70-3505-4551-90f8-754d1fd75b92": {
    "prompt": "You and a peer are reviewing each other's shared digital document. You spot a factual inaccuracy. How should you politely point it out in a comment? (Choose 2)",
    "options": {
      "opt_1": "Provide the accurate information in your comment with references if available.",
      "opt_2": "Highlight the error without explanation.",
      "opt_3": "Maintain a constructive, polite, and positive tone.",
      "opt_4": "Write the correction in ALL CAPS to ensure visibility."
    }
  },
  "fb784bb1-40a5-439d-9c2e-bd1c9766eeff": {
    "prompt": "Match each communication scenario with the most suitable communication medium.",
    "pairs": {
      "p1": {
        "left": "Ask a group a question to discuss video games.",
        "right": "Forum post"
      },
      "p2": {
        "left": "Request a refund from a company.",
        "right": "Email message"
      },
      "p3": {
        "left": "Let your brother know where to pick you up.",
        "right": "Text message"
      },
      "p_1794204255880_9q2q": {
        "left": "Share your daily reflections on news and events in an online journal.",
        "right": "Blog post"
      }
    }
  },
  "0f2ac055-73aa-420c-a964-6ec7b95ceb53": {
    "prompt": "Which two statements accurately define data encryption? (Choose 2)",
    "options": {
      "opt_1": "The contents of an encrypted file can only be read by authorized parties with the decryption key.",
      "opt_2": "An encrypted file cannot be transferred across the Internet.",
      "opt_3": "Encrypted documents require a password or digital key before they can be opened.",
      "opt_4": "Encrypted files are simply attachments with digital certificates."
    }
  },
  "67d51f2b-0542-48e9-a973-3eaf4067c173": {
    "prompt": "Which of the following statements about encryption are correct? (Choose two)",
    "options": {
      "opt_1": "The content of an encrypted file can only be decoded by someone possessing the decryption key.",
      "opt_2": "An encrypted document requires a password or digital credential to unlock.",
      "opt_3": "Encrypted documents are merely files with attached digital signatures.",
      "opt_4": "Encrypted files are blocked from Internet transmission."
    }
  },
  "86be26ba-9915-48b7-8077-8f6aa619ab7e": {
    "prompt": "Match each Artificial Intelligence risk with its corresponding description.",
    "pairs": {
      "p1": {
        "left": "Spreading misinformation or disinformation",
        "right": "Deception and lack of transparency"
      },
      "p2": {
        "left": "AI lacking understanding of cultural and ethical norms",
        "right": "Algorithmic bias and discrimination"
      },
      "p3": {
        "left": "AI misinterpreting the origin and intent of content",
        "right": "Lack of contextual understanding"
      }
    }
  },
  "c3b03bae-9ee6-49eb-98fa-1c17350a0cd9": {
    "prompt": "Which file format supports transparent backgrounds in logo graphics?",
    "options": {
      "opt_1": "PDF",
      "opt_2": "TIFF",
      "opt_3": "JPG",
      "opt_4": "PNG"
    }
  },
  "81b2f32e-f3f9-4db5-bab2-39a0c4a3ee0c": {
    "prompt": "A user searches for Yankee Candle, but the engine returns scattered results for Yankee or Candle separately. Which syntax searches for the exact phrase?",
    "options": {
      "opt_1": "Curly brackets { }",
      "opt_2": "Double quotation marks \" \"",
      "opt_3": "Square brackets [ ]",
      "opt_4": "Parentheses ( )"
    }
  },
  "b2d1a026-241b-42f5-a7ca-0f08d8e1f1cc": {
    "prompt": "You are collaborating with six peers across five different time zones globally. Which two tools are most effective for asynchronous communication? (Choose two)",
    "options": {
      "opt_1": "Video Conference",
      "opt_2": "Phone Call",
      "opt_3": "Text Messaging",
      "opt_4": "Email"
    }
  },
  "0f6313f9-3f6c-4a49-b9fe-60411df62bfc": {
    "prompt": "For each statement regarding file encryption, select True or False.",
    "statements": {
      "s1": "File encryption noticeably reduces file access speed.",
      "s2": "All files stored in cloud storage are encrypted by default.",
      "s3": "You can only open an encrypted file on the exact machine where it was encrypted."
    }
  },
  "0eb50686-3cb9-4d89-9f62-3aea325ed53e": {
    "prompt": "Order the steps to use the Microsoft Word Help feature to learn about Styles.",
    "pairs": {
      "p1": {
        "left": "Step 1",
        "right": "Click on the Help tab"
      },
      "p2": {
        "left": "Step 2",
        "right": "Click on Help icon"
      },
      "p3": {
        "left": "Step 3",
        "right": "Type: styles"
      },
      "p_1794204818383_tk25": {
        "left": "Step 4",
        "right": "Press Enter key"
      }
    }
  },
  "5985d520-5efd-4ac4-a6d5-ab4ecf59ca97": {
    "prompt": "Which of the following are cloud collaboration tools? (Choose 3)",
    "options": {
      "opt_1": "Google Docs",
      "opt_2": "Creative Cloud",
      "opt_3": "Bridge",
      "opt_4": "Box",
      "opt_1794204953117": "OneDrive"
    }
  },
  "63a2574f-0418-436f-a5a6-1c87d2e9a7b0": {
    "prompt": "A middle school student joins an online community sharing common hobbies. For each statement, choose whether it is an appropriate way to interact.",
    "statements": {
      "s1": "Introduce yourself and broadcast your personal email publicly.",
      "s2": "Assume other community members will treat shared data as strictly confidential.",
      "s3": "Share comments from the community to other public forums without attribution.",
      "s_1794205066177_o5to": "Reply respectfully to a thread even when voicing disagreement."
    }
  },
  "c4ff4ff8-9d26-4c87-85e4-3f5fa2bca33a": {
    "prompt": "A person should seek trusted advice before participating in any viral Internet challenge.",
    "options": {
      "opt_1": "True",
      "opt_2": "False"
    }
  },
  "de9b7bc8-8cbc-4549-8697-8817639f78da": {
    "prompt": "For each statement regarding centralized data storage, select True or False.",
    "statements": {
      "s1": "You can use an FTP client to upload and download files from a centralized storage system.",
      "s2": "Many centralized storage systems can automatically backup and sync updated file versions.",
      "s3": "When uploading a file to centralized cloud storage, the original file is deleted from your computer."
    }
  },
  "a166880e-51e4-4187-a3f0-9d9d376faca7": {
    "prompt": "When responding with disagreement to an online post, you should adopt the same aggressive tone as the original poster.",
    "options": {
      "opt_1": "True",
      "opt_2": "False"
    }
  },
  "8fa9d450-1445-415d-b5a1-854a90e818cc": {
    "prompt": "You want to email someone privately so other recipients cannot see their email address. Which field should you enter their address into?",
    "options": {
      "opt_1": "Bcc (Blind Carbon Copy)",
      "opt_2": "Cc (Carbon Copy)",
      "opt_3": "To",
      "opt_4": "Subject"
    }
  },
  "bc7a04b1-122a-4a4e-ab61-46923a341a0c": {
    "prompt": "Match each presentation design term with its corresponding definition.",
    "pairs": {
      "p1": {
        "left": "Animation",
        "right": "Visual effects that move objects into and out of slides"
      },
      "p2": {
        "left": "Transition",
        "right": "Special visual effect when navigating between slides"
      },
      "p3": {
        "left": "Template",
        "right": "A pre-designed file format with preset styles and fonts"
      },
      "p_1794205313112_j0lt": {
        "left": "Slide Master",
        "right": "The top slide that controls theme, layout, and global styling"
      }
    }
  },
  "fed5b3d2-30e2-4831-a042-45989ec5ffeb": {
    "prompt": "What is the primary benefit of file compression (ZIP/RAR)?",
    "options": {
      "opt_1": "Lowers file security.",
      "opt_2": "Slows down file reading.",
      "opt_3": "Decreases file size to speed up network transmission.",
      "opt_4": "Expands storage requirements."
    }
  },
  "574456b9-2669-439e-b356-49b7a07ff510": {
    "prompt": "What is the purpose of using Header and Footer features when formatting long documents?",
    "options": {
      "opt_1": "To insert oversized graphic images into text paragraphs.",
      "opt_2": "To generate automatic tables of contents based on headings.",
      "opt_3": "To modify page margins so more text fits onto a page.",
      "opt_4": "To run automatic grammar and spell checking.",
      "opt_1794205457228": "To automatically display page numbers and maintain uniform document info across all pages."
    }
  },
  "a9fe0e98-17f2-4ec6-9839-6f187017100a": {
    "prompt": "Which two accessibility features make computer usage easier for people with limited mobility?",
    "options": {
      "opt_1": "Phonetic keyboard",
      "opt_2": "Keyboard-only navigation shortcuts",
      "opt_3": "Speech-to-text / Voice dictation",
      "opt_4": "Larger monitor display"
    }
  },
  "6f2d5d6d-1b04-4b0e-8fb9-ae8bb6199e4d": {
    "prompt": "Why should teenagers exercise extreme caution and avoid participating in risky viral Internet Challenges? (Choose 2)",
    "options": {
      "opt_1": "Adolescent psychology makes teens susceptible to seeking validation through likes and social followers.",
      "opt_2": "Teenagers are developing and may not yet fully evaluate dangerous long-term consequences.",
      "opt_3": "Participating will instantly turn them into professional digital content creators.",
      "opt_4": "Deceptively simple challenges can lead to severe physical injuries or medical emergencies."
    }
  }
};

export const QUESTION_SET_TRANSLATIONS: Record<string, { title: string; description?: string }> = {
  "Ôn tập 1 khối 7": {
    title: "Grade 7 CS & Digital Literacy Review",
    description: "Comprehensive Grade 7 computer science, digital citizenship, and online safety curriculum."
  },
  "Bộ đề học sinh thử tạo lậu": {
    title: "Student Practice Quiz",
    description: "General knowledge and quick revision questions."
  },
  "Tổng hợp": {
    title: "General Knowledge Quiz",
    description: "Diverse curriculum questions across multiple subjects."
  }
};

/**
 * Localizes question content for the target language.
 * When language === 'en', replaces prompt, options, statements, pairs, etc. with English.
 * Preserves all option IDs and answer keys so server-side grading remains 100% intact.
 */
export function localizeQuestionContent(content: any, type: string, lang: "vi" | "en", questionId?: string): any {
  if (lang !== "en" || !content) return content;

  // 1. Direct translation if mapped by question ID
  const translation = questionId ? QUESTION_TRANSLATIONS[questionId] : null;

  // 2. Clone content
  const cloned = JSON.parse(JSON.stringify(content));

  if (translation) {
    if (translation.prompt) cloned.prompt = translation.prompt;

    if (translation.options && Array.isArray(cloned.options)) {
      cloned.options = cloned.options.map((opt: any) => ({
        ...opt,
        text: translation.options?.[opt.id] ?? opt.text,
      }));
    }

    if (translation.statements && Array.isArray(cloned.statements)) {
      cloned.statements = cloned.statements.map((st: any) => ({
        ...st,
        text: translation.statements?.[st.id] ?? st.text,
      }));
    }

    if (translation.pairs && Array.isArray(cloned.pairs)) {
      cloned.pairs = cloned.pairs.map((p: any) => ({
        ...p,
        left: translation.pairs?.[p.id]?.left ?? p.left,
        right: translation.pairs?.[p.id]?.right ?? p.right,
      }));
    }

    if (translation.dropdowns && Array.isArray(cloned.dropdowns)) {
      cloned.dropdowns = cloned.dropdowns.map((d: any) => ({
        ...d,
        options: translation.dropdowns?.[d.id] ?? d.options,
      }));
    }

    if (translation.passage) {
      cloned.passage = translation.passage;
    }

    return cloned;
  }

  // 3. Fallback: Search by matching prompt
  for (const item of Object.values(QUESTION_TRANSLATIONS)) {
    if (item.prompt && content.prompt && (item.prompt === content.prompt || content.prompt.includes("FOMO") || content.prompt.includes("webcam"))) {
      if (translation) break;
    }
  }

  return cloned;
}

/**
 * Localizes an entire question object (including id, type, content, points)
 */
export function localizeQuestion(question: any, lang: "vi" | "en"): any {
  if (!question || lang !== "en") return question;
  return {
    ...question,
    content: localizeQuestionContent(question.content, question.type, lang, question.id),
  };
}

/**
 * Localizes a question set's title and description
 */
export function localizeQuestionSet(set: any, lang: "vi" | "en"): any {
  if (!set || lang !== "en") return set;
  const translation = QUESTION_SET_TRANSLATIONS[set.title];
  if (translation) {
    return {
      ...set,
      title: translation.title,
      description: translation.description ?? set.description,
    };
  }
  return set;
}
