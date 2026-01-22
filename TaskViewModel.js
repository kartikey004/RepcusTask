import { useState, useEffect } from "react";

const USERS = ["Kartikey", "Keshav", "Sanika", "Spraiha"];
const PRIORITIES = ["low", "medium", "high", "critical"];
const TYPES = [
  "epic",
  "story",
  "task",
  "bug",
  "subtask",
  "incident",
  "service request",
  "change",
  "problem",
  "improvement",
];

const SUGGESTION_MAP = {
  "#": TYPES,
  "!": PRIORITIES,
  "@": USERS,
};

export const useTaskViewModel = () => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeTrigger, setActiveTrigger] = useState(null);

  const [parsedData, setParsedData] = useState({
    title: "",
    type: "task",
    priority: "medium",
    assignee: null,
    priorityColor: "#64748B",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const getPriorityColor = (p) => {
    switch (p) {
      case "critical":
        return "#DC2626";
      case "high":
        return "#EA580C";
      case "medium":
        return "#CA8A04";
      case "low":
        return "#2563EB";
      default:
        return "#64748B";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "epic":
        return "albums-outline";
      case "story":
        return "bookmark-outline";
      case "task":
        return "cog-outline";
      case "bug":
        return "bug-outline";
      case "subtask":
        return "return-down-forward-outline";
      case "incident":
        return "flash-outline";
      case "change":
        return "git-branch-outline";
      case "problem":
        return "help-circle-outline";
      case "improvement":
        return "trending-up-outline";
      default:
        return "document-text-outline";
    }
  };

  useEffect(() => {
    const words = inputValue.split(" ");
    const lastWord = words[words.length - 1];
    const trigger = lastWord.charAt(0);

    if (SUGGESTION_MAP[trigger]) {
      setActiveTrigger(trigger);
      const query = lastWord.slice(1).toLowerCase();

      const filtered = SUGGESTION_MAP[trigger]
        .filter((item) => item.toLowerCase().includes(query))
        .map((item) => ({
          label: item,
          color: "#42526E",
        }));

      setSuggestions(filtered);
    } else {
      setSuggestions([]);
      setActiveTrigger(null);
    }

    let text = inputValue;
    const newData = {
      type: "task",
      priority: "medium",
      assignee: null,
      priorityColor: getPriorityColor("medium"),
    };

    const typeMatch = text.match(/#(\w+)/);
    if (typeMatch && TYPES.includes(typeMatch[1].toLowerCase())) {
      newData.type = typeMatch[1].toLowerCase();
      text = text.replace(typeMatch[0], "");
    }
    const priorityMatch = text.match(/!(\w+)/);
    if (priorityMatch && PRIORITIES.includes(priorityMatch[1].toLowerCase())) {
      const p = priorityMatch[1].toLowerCase();
      newData.priority = p;
      newData.priorityColor = getPriorityColor(p);
      text = text.replace(priorityMatch[0], "");
    }

    const userMatch = text.match(/@(\w+)/);
    if (userMatch) {
      const match = USERS.find(
        (u) => u.toLowerCase() === userMatch[1].toLowerCase(),
      );
      if (match) {
        newData.assignee = match;
        text = text.replace(userMatch[0], "");
      }
    }

    newData.title = text.trim();
    setParsedData(newData);
  }, [inputValue]);

  // --- ACTIONS ---
  const applySuggestion = (itemLabel) => {
    const words = inputValue.split(" ");
    words.pop();
    const newText = [...words, `${activeTrigger}${itemLabel} `].join(" ");
    setInputValue(newText);
    setSuggestions([]);
  };

  const handleSubmit = () => {
    if (!parsedData.title) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      const ticketId = Math.floor(Math.random() * 9000) + 1000;

      const dynamicMsg = `Created ${parsedData.type.toUpperCase()} [FIX-${ticketId}]: ${parsedData.title}`;

      setSuccessMsg(dynamicMsg);
      setInputValue("");

      setTimeout(() => {
        setSuccessMsg(null);
      }, 3000);
    }, 800);
  };

  return {
    inputValue,
    setInputValue,
    suggestions,
    activeTrigger,
    applySuggestion,
    parsedData,
    isSubmitting,
    successMsg,
    handleSubmit,
    getTypeIcon,
    getPriorityColor,
  };
};
