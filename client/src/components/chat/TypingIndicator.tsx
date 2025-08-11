interface TypingUser {
  id: string;
  firstName?: string;
  lastName?: string;
}

interface TypingIndicatorProps {
  users: TypingUser[];
}

export function TypingIndicator({ users }: TypingIndicatorProps) {
  if (users.length === 0) return null;

  const getDisplayText = () => {
    if (users.length === 1) {
      const name = users[0].firstName || `User ${users[0].id.slice(0, 8)}`;
      return `${name} is typing...`;
    } else if (users.length === 2) {
      const name1 = users[0].firstName || `User ${users[0].id.slice(0, 8)}`;
      const name2 = users[1].firstName || `User ${users[1].id.slice(0, 8)}`;
      return `${name1} and ${name2} are typing...`;
    } else {
      return `${users.length} people are typing...`;
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm text-gray-400 px-3" data-testid="typing-indicator">
      <div className="flex gap-1">
        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span>{getDisplayText()}</span>
    </div>
  );
}