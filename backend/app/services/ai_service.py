import os
import random
from flask import current_app

class AIService:
    def __init__(self):
        try:
            self.api_key = current_app.config.get('GEMINI_API_KEY')
            self.has_gemini = bool(self.api_key)
        except RuntimeError:
            self.api_key = os.getenv('GEMINI_API_KEY')
            self.has_gemini = bool(self.api_key)
        
        self.model = None
        self.model_name = None
        if self.has_gemini:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                
                # List available models and use the first compatible one
                try:
                    models = genai.list_models()
                    available_models = []
                    for m in models:
                        if 'generateContent' in m.supported_generation_methods:
                            # Extract model name (remove 'models/' prefix if present)
                            model_name = m.name.replace('models/', '')
                            available_models.append(model_name)
                    
                    if available_models:
                        # Prefer flash models for speed, then pro models
                        preferred = [m for m in available_models if 'flash' in m.lower()]
                        if not preferred:
                            preferred = [m for m in available_models if 'pro' in m.lower()]
                        if not preferred:
                            preferred = available_models
                        
                        model_name = preferred[0]
                        self.model = genai.GenerativeModel(model_name)
                        self.model_name = model_name
                        print(f"✅ Using Google Gemini AI ({model_name})")
                    else:
                        raise Exception("No compatible models found")
                except Exception as e:
                    print(f"⚠️ Could not find compatible Gemini model: {e}")
                    # Fallback to trying common model names
                    model_names = ['gemini-pro', 'gemini-1.5-pro', 'gemini-1.5-flash']
                    for model_name in model_names:
                        try:
                            self.model = genai.GenerativeModel(model_name)
                            self.model_name = model_name
                            print(f"✅ Using Google Gemini AI ({model_name})")
                            break
                        except:
                            continue
                    if not self.model:
                        self.has_gemini = False
                        
            except ImportError:
                print("⚠️ google-generativeai package not installed")
                self.has_gemini = False
            except Exception as e:
                print(f"⚠️ Gemini initialization error: {e}")
                self.has_gemini = False
    
    def generate_healthcare_response(self, user_message, conversation_history=None, user_profile=None):
        """Generate healthcare-focused response using Gemini AI"""
        
        # If no Gemini key, use smart fallback
        if not self.has_gemini:
            print("🛟  Using fallback responses (No Gemini API key)")
            return self._get_fallback_response(user_message, conversation_history)
        
        try:
            print("🤖 Using Google Gemini AI for response...")
            import google.generativeai as genai
            
            # Healthcare-specific system prompt - doctor-like approach
            system_prompt = """You are Dr. Arogya, a compassionate and knowledgeable healthcare assistant. Act as a helpful medical advisor who provides practical guidance, suggests appropriate medications, and asks relevant questions to understand the patient's condition better.

Your role:
1. Act like a caring doctor - listen empathetically, ask clarifying questions, and provide actionable medical guidance.
2. Suggest appropriate over-the-counter medications, home remedies, and Ayurvedic treatments when relevant.
3. Provide specific dosage recommendations for common medications (e.g., paracetamol 500mg, ibuprofen 400mg) when appropriate.
4. Ask follow-up questions to better understand symptoms, duration, severity, and related factors.
5. Guide patients on when to seek immediate medical attention vs. when home care is sufficient.
6. Reference previous conversation context to maintain continuity and show you're paying attention.

Guidelines:
- Be proactive: Don't just answer - ask questions to understand the full picture.
- Be specific: When suggesting medicines, mention brand names (generic), dosages, and frequency (e.g., "Take Paracetamol 500mg every 6-8 hours").
- Combine modern medicine with traditional remedies: Suggest both pharmaceutical options and Ayurvedic/home remedies.
- Provide step-by-step guidance: Tell them exactly what to do next, what to monitor, and when to follow up.
- Ask relevant questions: Based on symptoms, ask about duration, triggers, associated symptoms, medical history, etc.
- Be conversational: Maintain a warm, doctor-patient relationship tone while being informative.
- CRITICAL: Do NOT repeat your introduction ("Hello, I am Dr. Arogya") if the conversation is already ongoing. Only introduce yourself at the very start of a new chat.

Response format:
- If this is a follow-up message, jump straight to addressing the user's latest concern without re-introducing yourself.
- Start with empathy and acknowledge their concern (briefly).
- Provide specific recommendations including:
  * Medications (with dosages if appropriate)
  * Home remedies and Ayurvedic treatments
  * Lifestyle adjustments
  * When to see a doctor
- Ask 2-3 relevant follow-up questions to better understand their condition.
- End with clear next steps and what to monitor."""

            style_nudges = [
                "Act like a doctor - be direct, helpful, and ask probing questions to understand the patient better.",
                "Provide specific medication recommendations with dosages when appropriate for the symptoms described.",
                "Combine evidence-based medical advice with practical home remedies and Ayurvedic treatments.",
                "Ask follow-up questions about symptom duration, severity, triggers, and associated symptoms.",
                "Be proactive - don't wait for the patient to ask, provide comprehensive guidance and next steps."
            ]
            
            # Build the prompt with context
            prompt_parts = [system_prompt]
            prompt_parts.append(random.choice(style_nudges))
            
            context_summary = self._build_context_summary(conversation_history)
            if context_summary:
                prompt_parts.append(f"\nConversation context summary to consider: {context_summary}")

            last_assistant = self._get_last_assistant_message(conversation_history)
            if last_assistant:
                prompt_parts.append(f"\nReference this previous guidance to maintain continuity: {last_assistant[:500]}")
            
            # Add conversation history if available
            if conversation_history:
                prompt_parts.append("\n\nPrevious conversation (Use this context to avoid repetition):")
                for msg in conversation_history[-10:]:  # Increased context window
                    role = "User" if msg['is_user'] else "Assistant"
                    prompt_parts.append(f"{role}: {msg['content']}")
                
                # Explicit instruction for ongoing conversations
                prompt_parts.append("\nIMPORTANT: This is an ongoing conversation. Do NOT say 'Hello I am Dr. Arogya' or similar introductions again. Continue the flow naturally.")
            
            # Add user profile context if available
            if user_profile:
                profile_context = ""
                if user_profile.get('age'):
                    profile_context += f"- Age: {user_profile['age']}\n"
                if user_profile.get('weight'):
                    profile_context += f"- Weight: {user_profile['weight']}\n"
                if user_profile.get('allergies'):
                    profile_context += f"- Allergies: {user_profile['allergies']}\n"
                if user_profile.get('conditions'):
                    profile_context += f"- Medical Conditions: {user_profile['conditions']}\n"
                
                if profile_context:
                    prompt_parts.append(f"\n\nPatient Profile Context (IMPORTANT: Adjust advice based on this):\n{profile_context}")

            prompt_parts.append(f"\n\nCurrent user message: {user_message}")
            prompt_parts.append("\n\nPlease provide a helpful, empathetic response following the guidelines above. Be direct and avoid repetitive pleasantries.")
            
            full_prompt = "\n".join(prompt_parts)
            
            # Generate response using Gemini - minimal safety restrictions for healthcare guidance
            try:
                from google.generativeai.types import HarmCategory, HarmBlockThreshold
                # Set to BLOCK_NONE for healthcare context - allow medical advice
                safety_settings = [
                    {"category": HarmCategory.HARM_CATEGORY_HARASSMENT, "threshold": HarmBlockThreshold.BLOCK_NONE},
                    {"category": HarmCategory.HARM_CATEGORY_HATE_SPEECH, "threshold": HarmBlockThreshold.BLOCK_NONE},
                    {"category": HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, "threshold": HarmBlockThreshold.BLOCK_NONE},
                    {"category": HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, "threshold": HarmBlockThreshold.BLOCK_NONE},
                ]
            except:
                # Fallback if enums not available - no safety settings
                safety_settings = None
            
            response = self.model.generate_content(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.9,
                    max_output_tokens=4000,
                ),
                safety_settings=safety_settings
            )
            
            # Extract text from response - handle various response formats
            if not response.candidates:
                raise Exception("No response candidates returned")
            
            candidate = response.candidates[0]
            
            # Extract text from response
            if candidate.content and candidate.content.parts:
                ai_response = candidate.content.parts[0].text.strip()
            elif hasattr(response, 'text') and response.text:
                ai_response = response.text.strip()
            else:
                # Try alternative extraction methods
                try:
                    ai_response = str(candidate.content).strip()
                except:
                    raise Exception("No valid response content available - response may have been filtered")
            
            # Add medical disclaimer
            disclaimer = "\n\n---\n*Disclaimer: I am an AI assistant providing general health information. I am not a medical professional. For serious symptoms, emergencies, or specific medical advice, please consult a healthcare provider.*"
            return ai_response + disclaimer
            
        except Exception as e:
            print(f"⚠️ Gemini API error: {e}")
            # Fallback to smart responses
            return self._get_fallback_response(user_message, conversation_history)

    def _build_context_summary(self, conversation_history):
        """Create a lightweight summary from conversation history to help the model stay contextual."""
        if not conversation_history:
            return ""

        user_msgs = [msg['content'] for msg in conversation_history if msg.get('is_user')]
        assistant_msgs = [msg['content'] for msg in conversation_history if not msg.get('is_user')]

        last_user = user_msgs[-2:] if user_msgs else []
        last_assistant = assistant_msgs[-2:] if assistant_msgs else []

        summary_parts = []
        if last_user:
            summary_parts.append("Recent user concerns: " + " | ".join(last_user))
        if last_assistant:
            summary_parts.append("Your recent guidance: " + " | ".join(last_assistant))

        return " ".join(summary_parts)[:600]

    def _get_last_assistant_message(self, conversation_history):
        if not conversation_history:
            return ""
        for msg in reversed(conversation_history):
            if not msg.get('is_user'):
                return msg.get('content', '')
        return ""

    def _get_fallback_response(self, user_message, conversation_history=None):
        """Smart fallback responses when OpenAI is not available"""
        user_message_lower = user_message.lower()
        previous_guidance = self._get_last_assistant_message(conversation_history)

        symptom_library = {
            'headache': [
                {
                    "summary": "You mentioned head discomfort that sounds tension related.",
                    "guidance": [
                        "Rest in a dim space, hydrate with ginger-infused warm water, and use a cool compress across your forehead.",
                        "Practice slow box-breathing (inhale 4, hold 4, exhale 6) and stretch the neck and shoulder area.",
                        "Note any red flags: sudden severe pain, vision changes, confusion."],
                    "next_steps": [
                        "Track triggers such as skipped meals or extended screen time.",
                        "Consult a clinician if the headache is sharp, new, or paired with neurological changes."],
                    "questions": [
                        "How long have these headaches been lasting lately?",
                        "Do you notice a pattern related to stress, posture, or screen use?"],
                },
                {
                    "summary": "You’re dealing with recurring head pain.",
                    "guidance": [
                        "Sip lemon water for hydration and consider soaking a teaspoon of fenugreek seeds overnight as an Ayurvedic anti-inflammatory.",
                        "Massage temples with diluted peppermint oil and alternate warm/cool compresses.",
                        "Check ergonomics: adjust monitor height and seating posture."],
                    "next_steps": [
                        "Keep a headache diary to share with your healthcare provider.",
                        "Seek urgent care if any numbness, speech difficulty, or fainting occurs."],
                    "questions": [
                        "Do you have sensitivity to light, sound, or nausea with the headache?",
                        "Have you tried over-the-counter pain relievers, and do they help?"],
                },
                {
                    "summary": "Sounds like ongoing head tension.",
                    "guidance": [
                        "Enjoy turmeric golden milk (turmeric, black pepper, warm milk or dairy alternative) to calm inflammation.",
                        "Take a short walk outdoors for fresh air and gentle circulation boost.",
                        "Use mindful breaks every 45–60 minutes to prevent muscle tension."],
                    "next_steps": [
                        "Practice progressive muscle relaxation before bed.",
                        "Discuss preventive strategies with a doctor if headaches are frequent or worsening."],
                    "questions": [
                        "Have you recently changed your sleep, diet, or caffeine habits?",
                        "Any additional symptoms like jaw clenching or neck stiffness?"],
                }
            ],
            'fever': [
                {
                    "summary": "You’ve described fever symptoms.",
                    "guidance": [
                        "Hydrate with coconut water, clear broths, or tulsi tea to maintain electrolytes.",
                        "Keep room temperature comfortable, wear light layers, and prioritize rest.",
                        "Consider a lukewarm sponge bath if fever feels uncomfortable."],
                    "next_steps": [
                        "Monitor temperature and note any new symptoms in case you need to share with a doctor.",
                        "Seek urgent care if fever exceeds 39.4°C (103°F), lasts over three days, or comes with rash, chest pain, or confusion."],
                    "questions": [
                        "Have you noticed chills, rash, or breathing difficulty?",
                        "Do you have underlying medical conditions or take immune-suppressing medication?"],
                },
                {
                    "summary": "Persistent fever symptoms noted.",
                    "guidance": [
                        "Sip coriander seed tea or rice/barley water to cool the body per Ayurvedic tradition.",
                        "Alternate rest with gentle movement and fresh air to prevent stiffness.",
                        "Eat light, easy-to-digest meals like khichdi or clear soups."],
                    "next_steps": [
                        "Check with a clinician before taking any fever-reducing medicine, especially for children or chronic conditions.",
                        "Seek immediate care if you develop a stiff neck, severe headache, or photophobia."],
                    "questions": [
                        "How high has the fever reached, and for how many days?",
                        "Any exposure to others with infections or recent travel?"],
                },
                {
                    "summary": "Managing fever and associated discomfort.",
                    "guidance": [
                        "If you can take paracetamol safely, alternate doses per label guidance to reduce discomfort.",
                        "Use eucalyptus steam inhalation if sinuses feel congested.",
                        "Tackle dehydration risk with diluted fruit juices or oral rehydration solution."],
                    "next_steps": [
                        "Rest frequently and avoid heavy exertion until fever resolves.",
                        "Contact a doctor right away if you or a child has a fever with lethargy, persistent vomiting, or dehydration signs."],
                    "questions": [
                        "Have you had fever-related complications before?",
                        "Are you able to eat and drink normally?"],
                }
            ],
            'sore throat': [
                {
                    "summary": "You’re describing throat irritation.",
                    "guidance": [
                        "Gargle with warm salt water and sip honey-ginger-tulsi tea to soothe the throat.",
                        "Use a humidifier or inhale steam with a drop of eucalyptus oil to ease dryness.",
                        "Avoid spicy or acidic foods that might worsen irritation."],
                    "next_steps": [
                        "Rest your voice and stay hydrated to promote healing.",
                        "See a healthcare provider if swallowing is difficult, you develop high fever, or symptoms persist beyond a week."],
                    "questions": [
                        "Do you notice white patches or swelling around the tonsils?",
                        "Have you experienced similar episodes recently?"],
                },
                {
                    "summary": "Persistent sore throat symptoms observed.",
                    "guidance": [
                        "Drink warm turmeric milk (haldi doodh) in the evening for anti-inflammatory support.",
                        "Use lozenges containing licorice root (mulethi) to soothe the throat lining.",
                        "Practice gentle pranayama, like alternate nostril breathing, to calm irritation."],
                    "next_steps": [
                        "Limit speaking where possible and use warm scarves to keep the throat protected.",
                        "Consult a clinician if you develop fever, ear pain, rash, or persistent soreness."],
                    "questions": [
                        "Any exposure to allergens, smoke, or infected individuals?",
                        "Are you experiencing hoarseness or cough along with the soreness?"],
                },
                {
                    "summary": "Ongoing throat discomfort shared.",
                    "guidance": [
                        "Drink room-temperature water frequently and try clove or mulethi to calm irritation.",
                        "Rest the voice, avoid whispering, and use warm compresses over the neck in the evening.",
                        "Consider warm soups or broths to stay nourished without straining the throat."],
                    "next_steps": [
                        "Schedule a medical visit if symptoms worsen or new signs like difficulty breathing appear.",
                        "Note symptom triggers (weather changes, allergens) to discuss with your doctor."],
                    "questions": [
                        "Do you have acid reflux or heartburn that might be contributing?",
                        "Are you taking any new medications or supplements recently?"],
                }
            ],
            'cough': [
                {
                    "summary": "You mentioned cough symptoms.",
                    "guidance": [
                        "Drink warm water with honey, lime, and a pinch of turmeric to soothe the throat.",
                        "Elevate your head while sleeping to ease nighttime coughing.",
                        "Inhale steam with ajwain (carom seeds) to open airways."],
                    "next_steps": [
                        "Limit cold drinks and rest your voice.",
                        "Consult a clinician if cough lasts more than three weeks, produces blood, or causes breathlessness."],
                    "questions": [
                        "Is the cough dry or producing mucus?",
                        "Do you have fever, chest pain, or wheezing alongside the cough?"],
                },
                {
                    "summary": "Persistent cough concerns noted.",
                    "guidance": [
                        "Sip thyme or tulsi tea, and keep a humidifier running to moisten airways.",
                        "Practice diaphragmatic (belly) breathing to loosen mucus.",
                        "Chew a small piece of ginger with rock salt as an Ayurvedic expectorant."],
                    "next_steps": [
                        "Monitor cough frequency and note triggers like dust or cold air.",
                        "Seek urgent care if you have chest tightness, high fever, or breathing difficulty."],
                    "questions": [
                        "Do you have asthma, allergies, or acid reflux history?",
                        "When did the cough start, and has it changed over time?"],
                },
                {
                    "summary": "Ongoing cough symptoms.",
                    "guidance": [
                        "Enjoy warm soups and consider gentle chest percussion (light taps) to mobilize mucus.",
                        "Take a teaspoon of kalonji (black seed) mixed with honey in the morning.",
                        "Limit dairy if it seems to thicken mucus."],
                    "next_steps": [
                        "Rest adequately and keep hydrated throughout the day.",
                        "Contact a healthcare professional if you lose weight unintentionally or hear wheezing."],
                    "questions": [
                        "Any exposure to smokers, pollutants, or new environments?",
                        "Are you currently on any medication for the cough?"],
                }
            ],
            'cold': [
                {
                    "summary": "Cold-like symptoms shared.",
                    "guidance": [
                        "Rest generously, drink warm water, and inhale steam with tulsi and mint.",
                        "Prepare a calming kadha (holy basil, ginger, black pepper) to ease congestion.",
                        "Keep rooms ventilated but not drafty."],
                    "next_steps": [
                        "Monitor symptom duration and severity.",
                        "Consult a clinician if symptoms worsen after a week or you develop high fever."],
                    "questions": [
                        "Do you have allergies that flare with weather changes?",
                        "Any sinus pressure or ear discomfort?"],
                },
                {
                    "summary": "Managing a stubborn cold.",
                    "guidance": [
                        "Use saline nasal rinses to clear mucus gently.",
                        "Eat vitamin-rich fruits (orange, kiwi) and keep nourishing soups in your diet.",
                        "Apply warm sesame oil to the chest and practice gentle breathing exercises."],
                    "next_steps": [
                        "Avoid sharing utensils or towels to protect others.",
                        "Seek medical care if you have asthma, chronic lung issues, or severe sinus pain."],
                    "questions": [
                        "Has anyone else around you been ill recently?",
                        "Do over-the-counter cold remedies relieve your symptoms?"],
                },
                {
                    "summary": "Cold symptoms with fatigue reported.",
                    "guidance": [
                        "Alternate warm herbal teas with plain water to stay well hydrated.",
                        "Eat light meals like khichdi or vegetable broth to support digestion.",
                        "Rest and keep stress low while you recover."],
                    "next_steps": [
                        "Use a cool-mist humidifier at night for easier breathing.",
                        "Consult a doctor if you notice ear pain, persistent fever, or shortness of breath."],
                    "questions": [
                        "Are you managing to sleep well despite the congestion?",
                        "Any changes in sense of taste or smell?"],
                }
            ]
        }

        emergency_keywords = ['emergency', 'urgent', '911', 'collapse', 'unconscious']
        chest_keywords = ['chest pain', 'chest discomfort', 'pressure in chest']
        greeting_keywords = ['hello', 'hi', 'hey']

        if any(keyword in user_message_lower for keyword in emergency_keywords):
            return (
                "If you or someone nearby is experiencing a potential medical emergency, call your local emergency number or visit the nearest emergency department immediately."
                " Severe symptoms like chest pain, trouble breathing, uncontrolled bleeding, sudden weakness, or unconsciousness require urgent professional care.\n\n---\n"
                "*Disclaimer: I am an AI assistant and not a medical professional. Emergency services can provide immediate, life-saving help.*"
            )

        if any(keyword in user_message_lower for keyword in chest_keywords):
            return (
                "Chest discomfort can signal serious heart or lung issues. Please seek emergency medical attention right away, especially if the pain is heavy, radiates to your arm or jaw, or is paired with sweating, nausea, or breathlessness."
                " Avoid delays—this deserves immediate evaluation by a healthcare professional.\n\n---\n"
                "*Disclaimer: I am an AI assistant and cannot assess emergencies. Contact emergency services now.*"
            )

        for symptom, advice_list in symptom_library.items():
            if symptom in user_message_lower:
                advice = random.choice(advice_list)
                guidance_items = random.sample(advice["guidance"], len(advice["guidance"]))
                next_steps_items = random.sample(advice["next_steps"], len(advice["next_steps"]))
                questions_items = random.sample(advice["questions"], len(advice["questions"]))
                guidance_lines = "\n".join(f"{idx+1}. {item}" for idx, item in enumerate(guidance_items))
                next_steps_lines = "\n".join(f"- {item}" for item in next_steps_items)
                questions_lines = "\n".join(f"• {question}" for question in questions_items)
                recap = "Earlier we talked about: " + previous_guidance[:160] + "..." if previous_guidance else ""
                response = (
                    (f"I remember we discussed {recap}\n" if recap else "")
                    + f"I hear you. {advice['summary']}\n\n"
                    f"Guidance:\n{guidance_lines}\n\n"
                    f"Next steps:\n{next_steps_lines}\n\n"
                    f"Questions for you:\n{questions_lines}"
                )
                return (
                    response
                    + "\n\n---\n*Disclaimer: I am an AI assistant providing general wellness information, not a medical professional. Consult qualified clinicians for diagnosis or treatment.*"
                )

        if any(word in user_message_lower for word in greeting_keywords):
            options = [
                "Hello! I’m here to help you reflect on your health concerns. Share what you’re feeling, and I’ll suggest supportive next steps and gentle home-care ideas.",
                "Hi there! Tell me about any symptoms, worries, or goals you have. I’ll respond with calm guidance, safe home practices, and tips on when to consult a clinician.",
                "Hey! I’m ready to listen. When you describe your symptoms, I’ll provide wellness pointers, Ayurvedic-inspired remedies, and medical safety advice."
            ]
            return random.choice(options) + "\n\n---\n*Disclaimer: I’m an AI assistant and not a substitute for professional medical advice.*"

        general_tips = [
            {
                "summary": "I want to make sure I understand your health goals.",
                "guidance": [
                    "Please share key symptoms, how long they’ve been present, and anything that eases or worsens them.",
                    "I’ll provide a mix of modern wellness and Ayurvedic-inspired suggestions once I have more detail."],
                "next_steps": [
                    "Consider keeping a quick symptom log to discuss with your clinician.",
                    "Gather any recent lab results or medications you’re taking to mention."],
                "questions": [
                    "What is the main symptom or concern right now?",
                    "Have you already spoken to a healthcare professional about this?"],
            },
            {
                "summary": "Let’s build a clearer picture of your health situation.",
                "guidance": [
                    "Describe how the issue affects your daily routine or sleep.",
                    "Share any home remedies or medicines you’ve tried so far."],
                "next_steps": [
                    "Collect relevant medical history (chronic illnesses, allergies) that might matter.",
                    "Note any upcoming appointments you have so we can plan questions."],
                "questions": [
                    "Is the concern acute (new) or chronic (ongoing)?",
                    "What do you hope to achieve or understand through this chat?"],
            },
            {
                "summary": "I’m here to support you responsibly.",
                "guidance": [
                    "Tell me about symptom timing, severity, and triggers so guidance can be tailored.",
                    "Mention lifestyle factors (stress, diet, activity) that might play a role."],
                "next_steps": [
                    "Prepare a list of medications or supplements you’re currently taking.",
                    "Consider recent changes—travel, new foods, environment—that might be relevant."],
                "questions": [
                    "What outcome or reassurance are you hoping for today?",
                    "Have you noticed patterns or cycles to the concern?"],
            }
        ]

        chosen = random.choice(general_tips)
        guidance_items = random.sample(chosen["guidance"], len(chosen["guidance"]))
        next_steps_items = random.sample(chosen["next_steps"], len(chosen["next_steps"]))
        questions_items = random.sample(chosen["questions"], len(chosen["questions"]))
        guidance_lines = "\n".join(f"{idx+1}. {item}" for idx, item in enumerate(guidance_items))
        next_steps_lines = "\n".join(f"- {item}" for item in next_steps_items)
        questions_lines = "\n".join(f"• {question}" for question in questions_items)

        recap = "Earlier we discussed: " + previous_guidance[:160] + "..." if previous_guidance else ""
        response = (
            (f"I still have in mind that {recap}\n" if recap else "")
            + f"I hear you. {chosen['summary']}\n\n"
            f"Guidance:\n{guidance_lines}\n\n"
            f"Next steps:\n{next_steps_lines}\n\n"
            f"Questions for you:\n{questions_lines}"
        )

        return (
            response
            + "\n\n---\n*Disclaimer: I am an AI assistant providing general wellness information. Please consult healthcare professionals for personalized medical advice.*"
        )

    def analyze_medical_report(self, image_data, mime_type):
        """Analyze a medical report image and provide a summary"""
        if not self.has_gemini:
            return "I apologize, but I cannot analyze reports without a valid AI service connection. Please check your system configuration."
            
        try:
            print(f"?? Analyzing medical report ({mime_type})...")
            import google.generativeai as genai
            
            system_prompt = """You are Dr. Arogya, an expert medical AI assistant specialized in analyzing medical reports.
            
            YOUR TASK:
            Analyze the provided medical report image deeply and provide a structured, professional, yet easy-to-understand summary.
            
            RESPONSE FORMAT (Use Markdown):
            
            ### 📄 Report Overview
            - **Type**: [e.g., Blood Test, MRI, Discharge Summary, Prescription]
            - **Date**: [Date if visible, else "Not visible"]
            
            ### 🔍 Key Findings
            - List *only* the abnormal, significant, or key findings.
            - Use bullet points.
            - Include specific values and reference ranges where visible (e.g., "Hemoglobin: 10.5 g/dL (Low, Normal: 13-17)").
            
            ### 🩺 Medical Interpretation
            - Explain *what* the findings mean in simple, non-medical language.
            - Connect related findings (e.g., "Low iron and low hemoglobin suggest Anemia").
            
            ### 💡 Recommendations
            - **Immediate Actions**: [e.g., "Consult a doctor about...", "Monitor blood pressure"]
            - **Lifestyle/Diet**: [e.g., "Increase iron-rich foods like spinach"]
            - **Questions for Doctor**: [Suggested questions the patient should ask]
            
            ⚠️ **IMPORTANT**:
            - If the image is NOT a medical report, reply: "I can only analyze medical reports. This image appears to be [description]."
            - Do not invent information. If text is blurry, say "Some text is unclear."
            - STRICTLY maintain a helpful and professional tone.
            """
            
            # Create image part
            image_part = {
                "mime_type": mime_type,
                "data": image_data
            }
            
            response = self.model.generate_content(
                [system_prompt, image_part],
                generation_config=genai.types.GenerationConfig(
                    temperature=0.4, # Lower temperature for analytical tasks
                    max_output_tokens=2000,
                )
            )
            
            if response.text:
                return response.text + "\n\n---\n*Disclaimer: AI analysis is for informational purposes only. Always consult a doctor for interpretation of medical reports.*"
            else:
                return "I couldn't generate a text response from this image. It might be unclear or flagged by safety filters."
                
        except Exception as e:
            print(f"?? Error analyzing report: {e}")
            return "I encountered an error while analyzing this report. Please ensure the image is clear and try again."

def get_ai_service():
    return AIService()
