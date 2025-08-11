import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import type { ChatMessage } from '@/lib/websocket';

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const getInitials = (message: ChatMessage) => {
    // This would ideally come from user data in the message
    return 'U'; // Placeholder - you'd get actual user info from the message
  };

  const formatTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`} data-testid={`message-${message.id}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage src="" alt="User" />
        <AvatarFallback className="bg-blue-600 text-white text-xs">
          {getInitials(message)}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-300">
            {isOwn ? 'You' : `User ${message.userId.slice(0, 8)}`}
          </span>
          <span className="text-xs text-gray-500">
            {formatTime(message.createdAt)}
          </span>
        </div>
        
        <div className={`
          px-3 py-2 rounded-lg max-w-full break-words
          ${isOwn 
            ? 'bg-blue-600 text-white' 
            : 'bg-slate-700 text-gray-100'
          }
          ${message.type === 'system' ? 'bg-slate-600 text-gray-300 italic' : ''}
        `}>
          {message.content}
        </div>
        
        {message.editedAt && (
          <span className="text-xs text-gray-500 mt-1">
            (edited)
          </span>
        )}
      </div>
    </div>
  );
}