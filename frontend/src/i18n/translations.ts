import { Language } from '../types';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    app_title: "SwasthyaSetu",
    subtitle: "Multilingual Rural Healthcare Triage & Safety System",
    badge_tag: "Multilingual • Offline-Capable • Safety-Gated",
    disclaimer: "This system is NOT a doctor and does NOT provide medical diagnosis.",
    disclaimer_title: "MANDATORY SAFETY NOTICE & DISCLAIMER",
    select_language: "Select Language",
    emergency_button: "EMERGENCY ALERT (108)",
    start_voice_triage: "Start Voice Triage",
    hero_title_1: "Multilingual Voice Triage for ",
    hero_title_2: "Rural Healthcare Access",
    hero_desc: "Accessible, voice-first preliminary symptom evaluation, deterministic emergency escalation, and verified healthcare facility referral designed for low-bandwidth environments.",
    
    // Landing Cards
    citizen_card_title: "Citizen App & Voice Triage",
    citizen_card_desc: "Voice-first symptom recording in Hindi, Marathi, or English. View risk levels and nearby clinics.",
    citizen_card_action: "Enter Citizen Portal",
    
    worker_card_title: "Healthcare Worker Portal",
    worker_card_desc: "ASHA worker case queue, clinical risk overrides, patient referrals, and follow-ups.",
    worker_card_action: "Enter Worker Portal (ASHA)",
    
    analytics_card_title: "Admin & Executive Dashboard",
    analytics_card_desc: "Patient master registry, ASHA worker referrals, OPD queue logs, and security audit trail.",
    analytics_card_action: "Enter Admin Dashboard",

    // Navigation Bar
    nav_patient: "Patient",
    nav_timeline: "Timeline",
    nav_slots: "Slots & Queue",
    nav_teleconsult: "Teleconsult",
    nav_medicines: "Medicines",
    nav_worker: "ASHA Worker",
    nav_admin: "Admin Portal",
    nav_quality: "Quality",
    nav_sync: "Sync",

    // Admin Panel
    admin_panel_title: "Executive Admin Portal & Patient Data Control Center",
    admin_panel_sub: "Central management system for patient records, ASHA referrals, OPD queue logs, and system audit trail",
    tab_executive: "Overview",
    tab_patient_registry: "Patient Records",
    tab_referrals: "ASHA Referrals",
    tab_queue_tokens: "OPD Queue Logs",
    tab_audit_logs: "Security & Audit",
    patient_id_label: "Patient ID",
    abdm_id_label: "ABDM Health ID",
    triage_symptoms_label: "Triage Symptoms",
    risk_level_label: "Risk Level",
    view_full_history: "View Clinical Case File",
    search_patient_placeholder: "Search patients by name, ID, or village...",

    // Integrated Care - Scheduling & Queue
    opd_scheduling_title: "Facility OPD Scheduling",
    opd_scheduling_sub: "Book visit to prevent long travel & queueing",
    confirmed_status: "CONFIRMED",
    department_label: "Department",
    general_opd: "General OPD",
    scheduled_label: "Scheduled",
    reason_label: "Reason",
    book_new_slot: "Book New Appointment Slot",
    live_queue_title: "Live Facility Queue Token",
    live_queue_sub: "Real-time wait estimation & position",
    your_queue_token: "YOUR QUEUE TOKEN",
    queue_position: "Queue Position",
    in_line_suffix: "in line",
    est_wait_time: "Est. Wait Time",
    mins_suffix: "mins",
    refresh_queue_token: "Refresh Live Queue Token",

    // Patient Timeline
    longitudinal_record: "Longitudinal Health Record",
    care_journey_title: "Patient Care Journey Timeline",
    patient_code_label: "Patient Code",
    back_to_dashboard: "Back to Dashboard",
    clinician_advice: "Clinician Advice",

    // Teleconsultation
    teleconsult_room_title: "Assisted Teleconsultation Room",
    specialty_label: "Specialty",
    active_video_session: "Active Video Session",
    ai_summary_title: "AI Clinical Summary Draft (Requires Clinician Review)",
    safety_rule_label: "Safety Rule: AI summary is administrative only. Final medical decision and prescription rests with the attending medical officer.",
    confirm_save_notes: "Confirm & Save Clinician Notes",

    // Medicine Search
    medicine_search_title: "Privacy-Preserving Medicine Availability Search",
    medicine_search_sub: "Search essential medicines at nearby health facilities without exposing exact stock counts",
    search_medicine_placeholder: "Search medicine by name or generic category...",
    available_status: "AVAILABLE",
    limited_status: "LIMITED",

    // High Risk Followups
    high_risk_title: "High-Risk Care Continuity & Follow-Up Tracker",
    high_risk_sub: "Maternal, Child Immunization, Chronic Disease, and Post-Referral Tracking",
    mark_completed: "Mark Completed",

    // Quality Dashboard
    quality_dashboard_title: "Facility Quality & Bottleneck Monitoring Dashboard",
    quality_dashboard_sub: "System-level accountability metrics to strengthen rural health service delivery",
    avg_opd_wait: "Avg OPD Wait Time",
    referral_completion_rate: "Referral Completion Rate",
    maternal_followup_rate: "Maternal Follow-up Rate",
    essential_medicine_stock: "Essential Medicine Stock",

    // Common UI
    voice_assistant: "Voice Symptom Assistant",
    tap_to_speak: "Tap to Speak Symptoms",
    listening: "Listening... Speak naturally in your language",
    processing_speech: "Processing speech...",
    text_symptoms: "Or type your symptoms",
    symptom_placeholder: "e.g., severe fever and headache for 2 days",
    assess_symptoms: "Assess Symptoms",
    urgency_level: "Urgency Level",
    reason: "Reasoning",
    next_step: "Recommended Next Step",
    nearest_facility: "Nearest Facility",
    referral_request: "Request Referral",
    patient_dashboard: "Patient Portal",
    worker_dashboard: "Healthcare Worker Portal",
    cases_queue: "Urgent Case Queue",
    override_assessment: "Override AI Category",
    notes: "Clinical Notes",
    offline_mode: "Offline Mode - Data will sync when online",
    sync_now: "Sync Now",
    privacy_notice: "Your health data is protected and used only for triage & navigation."
  },
  hi: {
    app_title: "स्वास्थ्यसेतु",
    subtitle: "बहुभाषी ग्रामीण स्वास्थ्य जांच और सुरक्षा प्रणाली",
    badge_tag: "बहुभाषी • ऑफ़लाइन-सक्षम • सुरक्षा-नियंत्रित",
    disclaimer: "यह प्रणाली डॉक्टर नहीं है और चिकित्सीय निदान प्रदान नहीं करती है।",
    disclaimer_title: "अनिवार्य सुरक्षा सूचना और अस्वीकरण",
    select_language: "भाषा चुनें",
    emergency_button: "आपातकालीन चेतावनी (108)",
    start_voice_triage: "आवाज़ से जांच शुरू करें",
    hero_title_1: "ग्रामीण स्वास्थ्य सेवा के लिए ",
    hero_title_2: "बहुभाषी आवाज़ लक्षण जांच",
    hero_desc: "कम इंटरनेट क्षेत्रों के लिए सुलभ, आवाज़-संचालित प्राथमिक लक्षण मूल्यांकन, स्वचालित आपातकालीन सहायता और सत्यापित अस्पताल रेफरल प्रणाली।",
    
    // Landing Cards
    citizen_card_title: "नागरिक ऐप और आवाज़ जांच",
    citizen_card_desc: "हिंदी, मराठी या अंग्रेजी में आवाज़ से लक्षण दर्ज करें। जोखिम स्तर और निकटतम अस्पताल देखें।",
    citizen_card_action: "नागरिक पोर्टल में प्रवेश करें",
    
    worker_card_title: "स्वास्थ्य कार्यकर्ता पोर्टल",
    worker_card_desc: "आशा (ASHA) कार्यकर्ता मामला सूची, क्लिनिकल जोखिम समीक्षा, अस्पताल रेफरल और फॉलो-अप।",
    worker_card_action: "आशा कार्यकर्ता पोर्टल में जाएं",
    
    analytics_card_title: "प्रशासक एवं कार्यकारी डैशबोर्ड",
    analytics_card_desc: "मरीज़ रिकॉर्ड, आशा कार्यकर्ता रेफरल, ओपीडी टोकन और सुरक्षा ऑडिट लॉग।",
    analytics_card_action: "एडमिन डैशबोर्ड में प्रवेश करें",

    // Navigation Bar
    nav_patient: "मरीज़",
    nav_timeline: "टाइमलाइन",
    nav_slots: "अपॉइंटमेंट और लाइन",
    nav_teleconsult: "वीडियो परामर्श",
    nav_medicines: "दवाएं",
    nav_worker: "आशा कार्यकर्ता",
    nav_admin: "एडमिन पोर्टल",
    nav_quality: "गुणवत्ता",
    nav_sync: "सिंक",

    // Admin Panel
    admin_panel_title: "कार्यकारी एडमिन पोर्टल और मरीज़ डेटा नियंत्रण केंद्र",
    admin_panel_sub: "मरीज़ रिकॉर्ड, आशा रेफरल, ओपीडी कतार लॉग और सिस्टम सुरक्षा ऑडिट का केंद्रीय प्रबंधन",
    tab_executive: "अवलोकन",
    tab_patient_registry: "मरीज़ रिकॉर्ड्स",
    tab_referrals: "आशा रेफरल्स",
    tab_queue_tokens: "ओपीडी कतार लॉग",
    tab_audit_logs: "सुरक्षा एवं ऑडिट",
    patient_id_label: "मरीज़ आईडी",
    abdm_id_label: "ABDM स्वास्थ्य आईडी",
    triage_symptoms_label: "जांच लक्षण",
    risk_level_label: "जोखिम स्तर",
    view_full_history: "क्लिनिकल रिकॉर्ड देखें",
    search_patient_placeholder: "नाम, आईडी या गांव से मरीज़ खोजें...",

    // Integrated Care - Scheduling & Queue
    opd_scheduling_title: "अस्पताल ओपीडी अपॉइंटमेंट",
    opd_scheduling_sub: "लंबी यात्रा और कतार से बचने के लिए समय बुक करें",
    confirmed_status: "पुष्टि की गई",
    department_label: "विभाग",
    general_opd: "सामान्य ओपीडी",
    scheduled_label: "समय निर्धारित",
    reason_label: "कारण",
    book_new_slot: "नया अपॉइंटमेंट स्लॉट बुक करें",
    live_queue_title: "लाइव अस्पताल कतार टोकन",
    live_queue_sub: "वास्तविक समय प्रतीक्षा अनुमान और स्थिति",
    your_queue_token: "आपका कतार टोकन",
    queue_position: "कतार में स्थिति",
    in_line_suffix: "नंबर पर",
    est_wait_time: "अनुमानित प्रतीक्षा समय",
    mins_suffix: "मिनट",
    refresh_queue_token: "लाइव कतार टोकन रीफ्रेश करें",

    // Patient Timeline
    longitudinal_record: "निरंतर स्वास्थ्य रिकॉर्ड",
    care_journey_title: "मरीज़ देखभाल यात्रा टाइमलाइन",
    patient_code_label: "मरीज़ कोड",
    back_to_dashboard: "डैशबोर्ड पर वापस जाएं",
    clinician_advice: "डॉक्टर की सलाह",

    // Teleconsultation
    teleconsult_room_title: "सहायता प्राप्त वीडियो परामर्श कक्ष",
    specialty_label: "विशेषज्ञता",
    active_video_session: "सक्रिय वीडियो सत्र",
    ai_summary_title: "AI क्लिनिकल सारांश प्रारूप (डॉक्टर समीक्षा आवश्यक)",
    safety_rule_label: "सुरक्षा नियम: AI सारांश केवल प्रशासनिक है। अंतिम चिकित्सा निर्णय और दवा पर्चा डॉक्टर का होगा।",
    confirm_save_notes: "पुष्टि करें और डॉक्टर के नोट्स सहेजें",

    // Medicine Search
    medicine_search_title: "गोपनीयता-सुरक्षित दवा उपलब्धता खोज",
    medicine_search_sub: "सटीक स्टॉक संख्या उजागर किए बिना निकटतम स्वास्थ्य केंद्रों में आवश्यक दवाएं खोजें",
    search_medicine_placeholder: "नाम या जेनेरिक श्रेणी द्वारा दवा खोजें...",
    available_status: "उपलब्ध",
    limited_status: "सीमित",

    // High Risk Followups
    high_risk_title: "उच्च जोखिम देखभाल निरंतरता और फॉलो-अप ट्रैकर",
    high_risk_sub: "मातृ, बाल टीकाकरण, दीर्घकालिक बीमारी और रेफरल के बाद की ट्रैकिंग",
    mark_completed: "पूर्ण के रूप में चिह्नित करें",

    // Quality Dashboard
    quality_dashboard_title: "अस्पताल गुणवत्ता और बाधा निगरानी डैशबोर्ड",
    quality_dashboard_sub: "ग्रामीण स्वास्थ्य सेवा वितरण को मजबूत करने के लिए प्रणालीगत जवाबदेही मेट्रिक्स",
    avg_opd_wait: "औसत ओपीडी प्रतीक्षा समय",
    referral_completion_rate: "रेफरल पूर्णता दर",
    maternal_followup_rate: "मातृ फॉलो-अप दर",
    essential_medicine_stock: "आवश्यक दवा स्टॉक",

    // Common UI
    voice_assistant: "आवाज़ लक्षण सहायक",
    tap_to_speak: "लक्षण बोलने के लिए दबाएं",
    listening: "सुन रहे हैं... अपनी भाषा में बोलें",
    processing_speech: "आवाज़ प्रोसेस हो रही है...",
    text_symptoms: "या अपने लक्षण लिखें",
    symptom_placeholder: "उदा. 2 दिनों से तेज़ बुखार और सिरदर्द",
    assess_symptoms: "लक्षणों का आकलन करें",
    urgency_level: "अति-आवश्यकता स्तर",
    reason: "कारण",
    next_step: "अनुशंसित अगला कदम",
    nearest_facility: "निकटतम स्वास्थ्य केंद्र",
    referral_request: "रेफरल का अनुरोध करें",
    patient_dashboard: "मरीज़ पोर्टल",
    worker_dashboard: "स्वास्थ्य कार्यकर्ता पोर्टल",
    cases_queue: "आपातकालीन मामले",
    override_assessment: "AI श्रेणी बदलें",
    notes: "डॉक्टर/कार्यकर्ता नोट्स",
    offline_mode: "ऑफ़लाइन मोड - ऑनलाइन होने पर सिंक होगा",
    sync_now: "अभी सिंक करें",
    privacy_notice: "आपकी स्वास्थ्य जानकारी सुरक्षित है।"
  },
  mr: {
    app_title: "स्वास्थ्‍यसेतू",
    subtitle: "बहुभाषिक ग्रामीण आरोग्य तपासणी आणि सुरक्षा प्रणाली",
    badge_tag: "बहुभाषिक • ऑफलाईन-सक्षम • सुरक्षा-नियंत्रित",
    disclaimer: "ही प्रणाली डॉक्टर नाही आणि वैद्यकीय निदान करत नाही.",
    disclaimer_title: "अनिवार्य सुरक्षा सूचना आणि स्पष्टीकरण",
    select_language: "भाषा निवडा",
    emergency_button: "तातडीची मदत (108)",
    start_voice_triage: "आवाजाद्वारे तपासणी सुरू करा",
    hero_title_1: "ग्रामीण आरोग्यासाठी ",
    hero_title_2: "बहुभाषिक आवाज लक्षण तपासणी",
    hero_desc: "कमी इंटरनेट भागांसाठी सुलभ, आवाज-आधारित प्राथमिक लक्षण मूल्यांकन, आपत्कालीन मदत आणि नोंदणीकृत रुग्णालय मार्गदर्शन प्रणाली.",
    
    // Landing Cards
    citizen_card_title: "नागरिक ॲप आणि आवाज तपासणी",
    citizen_card_desc: "मराठी, हिंदी किंवा इंग्रजीत आवाजाद्वारे लक्षणे नोंदवा. धोक्याची पातळी आणि जवळचे दवाखाने पहा.",
    citizen_card_action: "नागरिक पोर्टलवर जा",
    
    worker_card_title: "आरोग्य सेविका पोर्टल",
    worker_card_desc: "आशा (ASHA) सेविका रुग्ण यादी, वैद्यकीय धोक्यांचे पुनरावलोकन, रुग्णालय शिफारसी आणि पाठपुरावा.",
    worker_card_action: "आशा सेविका पोर्टलवर जा",
    
    analytics_card_title: "प्रशासक आणि कार्यकारी डॅशबोर्ड",
    analytics_card_desc: "रुग्ण नोंदी, आशा सेविका शिफारसी, ओपीडी टोकन आणि सुरक्षा नोंदी.",
    analytics_card_action: "एडमिन डॅशबोर्डवर जा",

    // Navigation Bar
    nav_patient: "रुग्ण",
    nav_timeline: "टाइमलाईन",
    nav_slots: "वेळ आणि रांग",
    nav_teleconsult: "व्हिडिओ सल्ला",
    nav_medicines: "औषधे",
    nav_worker: "आशा सेविका",
    nav_admin: "एडमिन पोर्टल",
    nav_quality: "गुणवत्ता",
    nav_sync: "सिंक",

    // Admin Panel
    admin_panel_title: "कार्यकारी एडमिन पोर्टल आणि रुग्ण माहिती केंद्र",
    admin_panel_sub: "रुग्ण नोंदी, आशा शिफारसी, ओपीडी रांग आणि सिस्टम सुरक्षा नोंदींचे मध्यवर्ती व्यवस्थापन",
    tab_executive: "आढावा",
    tab_patient_registry: "रुग्ण नोंदी",
    tab_referrals: "आशा शिफारसी",
    tab_queue_tokens: "ओपीडी रांग नोंदी",
    tab_audit_logs: "सुरक्षा आणि ऑडिट",
    patient_id_label: "रुग्ण आयडी",
    abdm_id_label: "ABDM आरोग्य आयडी",
    triage_symptoms_label: "तपासणी लक्षणे",
    risk_level_label: "धोका पातळी",
    view_full_history: "वैद्यकीय नोंद पहा",
    search_patient_placeholder: "नाव, आयडी किंवा गावातून रुग्ण शोधा...",

    // Integrated Care - Scheduling & Queue
    opd_scheduling_title: "दवाखाना ओपीडी अपॉइंटमेंट",
    opd_scheduling_sub: "लांबचा प्रवास आणि रांग टाळण्यासाठी वेळ बुक करा",
    confirmed_status: "निश्चित",
    department_label: "विभाग",
    general_opd: "जनरल ओपीडी",
    scheduled_label: "वेळ निश्चित",
    reason_label: "कारण",
    book_new_slot: "नवीन अपॉइंटमेंट स्लॉट बुक करा",
    live_queue_title: "थेट रांग टोकन",
    live_queue_sub: "रिअल-टाइम वाट पाहण्याचा वेळ आणि स्थान",
    your_queue_token: "तुमचे रांग टोकन",
    queue_position: "रांगेतील स्थान",
    in_line_suffix: "क्रमांकावर",
    est_wait_time: "अंदाजे वाट पाहण्याचा वेळ",
    mins_suffix: "मिनिटे",
    refresh_queue_token: "थेट रांग टोकन ताजे करा",

    // Patient Timeline
    longitudinal_record: "सतत आरोग्य नोंद",
    care_journey_title: "रुग्ण काळजी प्रवास टाइमलाईन",
    patient_code_label: "रुग्ण कोड",
    back_to_dashboard: "डॅशबोर्डवर परत जा",
    clinician_advice: "वैद्यकीय सल्ला",

    // Teleconsultation
    teleconsult_room_title: "सहाय्यित व्हिडिओ सल्ला दालन",
    specialty_label: "विशेषज्ञता",
    active_video_session: "सक्रिय व्हिडिओ सत्र",
    ai_summary_title: "AI क्लिनिकल सारांश मसुदा (डॉक्टरांची पडताळणी आवश्यक)",
    safety_rule_label: "सुरक्षा नियम: AI सारांश फक्त प्रशासकीय आहे. अंतिम वैद्यकीय निर्णय आणि औषधपत्रिका डॉक्टरांचीच असेल.",
    confirm_save_notes: "पडताळणी करा आणि डॉक्टरांच्या नोंदी जतन करा",

    // Medicine Search
    medicine_search_title: "गोपनीयता-सुरक्षित औषध उपलब्धता शोध",
    medicine_search_sub: "अचूक साठा न दाखवता जवळच्या आरोग्य केंद्रांमधील आवश्यक औषधे शोधा",
    search_medicine_placeholder: "नाव किंवा प्रकारानुसार औषध शोधा...",
    available_status: "उपलब्ध",
    limited_status: "मर्यादित",

    // High Risk Followups
    high_risk_title: "उच्च धोका काळजी आणि पाठपुरावा ट्रॅकर",
    high_risk_sub: "माता, बाल लसीकरण, तीव्र आजार आणि रुग्णालय पाठपुरावा",
    mark_completed: "पूर्ण झाल्याचे नोंदवा",

    // Quality Dashboard
    quality_dashboard_title: "दवाखाना गुणवत्ता आणि अडथळा देखरेख डॅशबोर्ड",
    quality_dashboard_sub: "ग्रामीण आरोग्य सेवा बळकट करण्यासाठी प्रणालीगत जबाबदारी मेट्रिक्स",
    avg_opd_wait: "सरासरी ओपीडी वाट पाहण्याचा वेळ",
    referral_completion_rate: "रुग्णालय शिफारस पूर्णता दर",
    maternal_followup_rate: "माता पाठपुरावा दर",
    essential_medicine_stock: "आवश्यक औषध साठा",

    // Common UI
    voice_assistant: "आवाज लक्षण सहाय्यक",
    tap_to_speak: "लक्षणे सांगण्यासाठी दाबा",
    listening: "ऐकत आहोत... तुमच्या भाषेत बोला",
    processing_speech: "आवाज प्रक्रिया सुरू आहे...",
    text_symptoms: "किंवा लक्षणे टाईप करा",
    symptom_placeholder: "उदा. २ दिवसांपासून तीव्र ताप आणि डोकेदुखी",
    assess_symptoms: "लक्षणे तपासा",
    urgency_level: "तात्काळता पातळी",
    reason: "कारण",
    next_step: "पुढील पाऊल",
    nearest_facility: "जवळचे आरोग्य केंद्र",
    referral_request: "रेफरल विनंती करा",
    patient_dashboard: "रुग्ण पोर्टल",
    worker_dashboard: "आरोग्य सेवक पोर्टल",
    cases_queue: "तातडीच्या केसेस",
    override_assessment: "AI वर्ग बदला",
    notes: "वैद्यकीय नोंदी",
    offline_mode: "ऑफलाईन मोड - ऑनलाईन झाल्यावर सिंक होईल",
    sync_now: "आत्ता सिंक करा",
    privacy_notice: "तुमची आरोग्य माहिती सुरक्षित आहे."
  }
};
