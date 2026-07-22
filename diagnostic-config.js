window.ISPY_QUIZ_CONFIG = {
  meta: {
    title: "Find your next brand move",
    titleLineOne: "Find your next",
    titleLineTwo: "brand move",
    eyebrow: "i-Spy Brand Check",
    intro:
      "Answer a few quick questions to see what may be holding your brand, message or creative work back, and where to focus next.\n\nIt takes about two minutes.",
    estimatedTime: "",
    startButton: "Begin",
    backButton: "Back",
    nextButton: "Next",
    resultButton: "See my result",
    progressLabel: "Question {current} of {total}",
    selectionRequired: "Choose one answer to continue.",
    secondaryInsightLabel: "Secondary insight",
    resultLabel: "Your result",
    recommendationLabel: "Recommendation",
    emailHeading: "If this feels relevant, let’s chat.",
    emailLabel: "Email address",
    emailPlaceholder: "name@company.com",
    emailButton: "Email Michael",
    reviewAnswers: "Review your answers",
    emailSuccess: "",
    ctaLabel: "Arrange a call",
    ctaUrl: "mailto:michael@i-spy.uk?subject=Arrange%20a%20call",
    ctaIntro:
      "If the result rings true, Michael can help you work out what to do next.",
    distinction:
      "The Brand Check is a quick, self-guided starting point. A Brand Diagnosis is a deeper independent review led by Michael."
  },

  outcomes: {
    S1: {
      title: "Brand Direction",
      shortLabel: "Brand Direction",
      summary:
        "Your next move is to make the few brand decisions that everything else depends on.",
      recommendation:
        "Agree who you are for, what you want to be known for and what the brand needs to make easier for the business."
    },
    S2: {
      title: "Creative Direction & Delivery",
      shortLabel: "Creative direction and delivery",
      summary:
        "Your next move is to strengthen how the brand looks, sounds and behaves so the business shows up more consistently.",
      recommendation:
        "Look at the foundations of your verbal and visual identity, then build a system that helps teams express the brand without reinventing it every time."
    },
    S3: {
      title: "Proposition & Messaging",
      shortLabel: "Proposition and messaging",
      summary:
        "Your next brand move is to simplify how the offer, messages and brand structure fit together.",
      recommendation:
        "Reduce overlap, clarify the hierarchy, and make it easier for customers and internal teams to understand what belongs where."
    },
    S4: {
      title: "Brand Diagnosis",
      shortLabel: "Brand Diagnosis",
      summary:
        "Your next move is to get an independent view before you commit to a rebrand, website or campaign.",
      recommendation:
        "Use customer, competitor and stakeholder insight to test assumptions and separate internal opinion from meaningful market evidence."
    },
    S5: {
      title: "Brand Partnership",
      shortLabel: "Brand Partnership",
      summary:
        "Your next move is to bring in ongoing brand leadership and creative delivery so the work stays consistent and keeps moving.",
      recommendation:
        "Decide where your team needs outside guidance, creative direction or hands-on delivery, then shape the partnership around that."
    },
    S6: {
      title: "Put your brand to work",
      shortLabel: "Put the brand to work",
      summary:
        "Your brand and message are broadly clear. The next move is to apply them more consistently and confidently across campaigns, content and customer-facing communications.",
      recommendation:
        "Focus on the channels and moments that matter most, then build stronger creative work around them. This would usually sit within Creative Direction & Delivery, or Brand Partnership when the need is ongoing."
    }
  },

  tieBreakPriority: ["S1", "S4", "S3", "S2", "S5", "S6"],

  roleIntros: {
    owner:
      "As a business owner, this result highlights the decision most likely to make the next step easier.",
    leadership:
      "For a leadership team, it shows where stronger agreement could make the brand easier to lead.",
    marketing:
      "For a marketing lead, it shows where clearer choices could make the work easier to brief and deliver.",
    growth:
      "For a growth-focused role, it shows where clearer brand communication could make the business easier to notice and understand.",
    other:
      "Based on your answers, this is the area most likely to need attention first."
  },

  painAlignment: {
    aligned:
      "That matches the challenge you chose at the start, so your answers reinforce what you already suspected.",
    different:
      "You chose {pain} at the start. Your answers point more strongly to {result}. That may be the issue sitting underneath it."
  },

  questions: [
    {
      id: "role",
      type: "role",
      eyebrow: "First, a little context",
      title: "Which best describes you?",
      helpText: "This helps tailor the result. It doesn't affect your score.",
      requiredMessage: "Choose the role that feels closest.",
      answers: [
        { id: "owner", label: "Business owner or founder" },
        { id: "leadership", label: "Leadership team member" },
        { id: "marketing", label: "Marketing director or lead" },
        { id: "growth", label: "Growth-focused commercial role" },
        { id: "other", label: "Something else" }
      ]
    },
    {
      id: "pain",
      type: "pain",
      eyebrow: "What feels most pressing?",
      title: "What is the main brand challenge right now?",
      helpText: "Choose the one that feels closest. Your other answers may point somewhere different.",
      requiredMessage: "Choose the challenge that feels most pressing.",
      answers: [
        {
          id: "direction",
          label: "We need clearer direction and positioning",
          outcome: "S1",
          weights: { S1: 2, S4: 1 }
        },
        {
          id: "identity",
          label: "Our identity does not feel strong or consistent enough",
          outcome: "S2",
          weights: { S2: 2, S1: 1 }
        },
        {
          id: "complexity",
          label: "Our offer, messages or structure feel too complicated",
          outcome: "S3",
          weights: { S3: 2, S1: 1 }
        },
        {
          id: "perspective",
          label: "We are too close to it and need outside perspective",
          outcome: "S4",
          weights: { S4: 2, S1: 1 }
        },
        {
          id: "capacity",
          label: "We need senior support or extra capacity",
          outcome: "S5",
          weights: { S5: 2, S1: 1 }
        },
        {
          id: "awareness",
          label: "We need campaigns or content that make us easier to notice",
          outcome: "S6",
          weights: { S6: 2, S1: 1 }
        }
      ]
    },
    {
      id: "q1",
      type: "diagnostic",
      eyebrow: "Direction",
      title: "How clear is the brand strategy inside the business?",
      answers: [
        {
          id: "clear",
          label: "Very clear, and people use it to make decisions",
          weights: { S6: 3, S2: 1 }
        },
        {
          id: "partial",
          label: "Clear in places, but not consistently applied",
          weights: { S1: 3, S5: 1 }
        },
        {
          id: "unclear",
          label: "Different people would describe it differently",
          weights: { S1: 4, S4: 2 }
        }
      ]
    },
    {
      id: "q2",
      type: "diagnostic",
      eyebrow: "Audience",
      title: "How confident are you in what customers truly value?",
      answers: [
        {
          id: "evidence",
          label: "We have recent evidence and a clear view",
          weights: { S6: 2, S1: 1 }
        },
        {
          id: "assumptions",
          label: "We have useful assumptions but limited evidence",
          weights: { S4: 4, S1: 2 }
        },
        {
          id: "divided",
          label: "Internal opinions often pull us in different directions",
          weights: { S4: 4, S1: 3 }
        }
      ]
    },
    {
      id: "q3",
      type: "diagnostic",
      eyebrow: "Expression",
      title: "How well does your brand identity support the business you are becoming?",
      answers: [
        {
          id: "fit",
          label: "It fits well and gives us a strong platform",
          weights: { S6: 2, S5: 1 }
        },
        {
          id: "dated",
          label: "It works, but parts feel dated or underpowered",
          weights: { S2: 4, S1: 1 }
        },
        {
          id: "fragmented",
          label: "It feels fragmented across teams, channels or markets",
          weights: { S2: 4, S3: 2, S5: 1 }
        }
      ]
    },
    {
      id: "q4",
      type: "diagnostic",
      eyebrow: "Simplicity",
      title: "How easy is it for people to understand what you offer?",
      answers: [
        {
          id: "easy",
          label: "Easy. The offer and message are focused",
          weights: { S6: 3, S2: 1 }
        },
        {
          id: "needs-work",
          label: "It depends who is explaining it",
          weights: { S3: 4, S1: 2 }
        },
        {
          id: "complex",
          label: "Too many services, messages or sub-brands compete for attention",
          weights: { S3: 5, S1: 1 }
        }
      ]
    },
    {
      id: "q5",
      type: "diagnostic",
      eyebrow: "Internal use",
      title: "What happens when teams need to create brand or marketing work?",
      answers: [
        {
          id: "self-serve",
          label: "They have clear guidance and can move confidently",
          weights: { S6: 2, S5: 1 }
        },
        {
          id: "bottleneck",
          label: "Work slows down because decisions need senior input",
          weights: { S5: 4, S2: 1 }
        },
        {
          id: "reinvent",
          label: "People reinvent messages, visuals or campaigns each time",
          weights: { S5: 3, S2: 3, S3: 1 }
        }
      ]
    },
    {
      id: "q6",
      type: "diagnostic",
      eyebrow: "Market presence",
      title: "How visible and distinctive are you in the market?",
      answers: [
        {
          id: "visible",
          label: "Visible, consistent and easy to recognise",
          weights: { S5: 1, S6: 2 }
        },
        {
          id: "quiet",
          label: "The brand is credible, but too quiet",
          weights: { S6: 5, S2: 1 }
        },
        {
          id: "generic",
          label: "We struggle to stand out or explain why us",
          weights: { S1: 3, S6: 3, S4: 1 }
        }
      ]
    },
    {
      id: "q7",
      type: "diagnostic",
      eyebrow: "Decision-making",
      title: "Where do brand decisions tend to get stuck?",
      answers: [
        {
          id: "not-stuck",
          label: "They usually move through with clear ownership",
          weights: { S6: 2, S5: 1 }
        },
        {
          id: "alignment",
          label: "Senior stakeholders are not always aligned",
          weights: { S1: 4, S4: 2 }
        },
        {
          id: "capacity-stuck",
          label: "The thinking is there, but no one has enough time to drive it",
          weights: { S5: 5, S6: 1 }
        }
      ]
    },
    {
      id: "q8",
      type: "diagnostic",
      eyebrow: "Next step",
      title: "What would make the biggest difference over the next six months?",
      answers: [
        {
          id: "choices",
          label: "Sharper strategic choices",
          weights: { S1: 5, S4: 1 }
        },
        {
          id: "system",
          label: "A stronger brand system people can use",
          weights: { S2: 5, S5: 1 }
        },
        {
          id: "simplify",
          label: "Simplifying the offer and message",
          weights: { S3: 5, S1: 1 }
        },
        {
          id: "evidence",
          label: "Better evidence and outside challenge",
          weights: { S4: 5, S1: 1 }
        },
        {
          id: "support",
          label: "Senior support to move faster",
          weights: { S5: 5, S6: 1 }
        },
        {
          id: "activation",
          label: "Campaigns and content that make the brand easier to notice",
          weights: { S6: 5, S2: 1 }
        }
      ]
    }
  ]
};
