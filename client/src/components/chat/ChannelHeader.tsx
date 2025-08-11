import { Hash, Lock, Users, Settings, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChannelHeaderProps {
  channelName: string;
  channelType: 'public' | 'private' | 'direct';
  isConnected: boolean;
  onlineCount?: number;
}

export function ChannelHeader({ channelName, channelType, isConnected, onlineCount = 0 }: ChannelHeaderProps) {
  const getChannelIcon = () => {
    switch (channelType) {
      case 'private':
        return <Lock className="h-4 w-4" />;
      case 'direct':
        return <Users className="h-4 w-4" />;
      default:
        return <Hash className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800">
      <div className="flex items-center gap-2">
        <div className="text-gray-400">
          {getChannelIcon()}
        </div>
        <h2 className="font-semibold text-white" data-testid="text-channel-name">
          {channelName}
        </h2>
        <div className="flex items-center gap-1 text-sm text-gray-400">
          {isConnected ? (
            <Wifi className="h-3 w-3 text-green-400" />
          ) : (
            <WifiOff className="h-3 w-3 text-red-400" />
          )}
          <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onlineCount > 0 && (
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Users className="h-3 w-3" />
            <span data-testid="text-online-count">{onlineCount}</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
          data-testid="button-channel-settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}