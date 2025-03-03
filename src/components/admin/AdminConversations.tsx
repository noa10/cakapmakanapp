import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Conversation {
  id: string;
  userId: string;
  startedAt: Date;
  lastMessage: string;
  status: 'active' | 'completed' | 'archived';
}

const AdminConversations = () => {
  const { toast } = useToast();
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // TODO: Fetch conversations from the backend
    const fetchConversations = async () => {
      try {
        // Simulated data for now
        const mockConversations: Conversation[] = [
          {
            id: '1',
            userId: 'user1',
            startedAt: new Date(),
            lastMessage: 'Hello, I want to order food',
            status: 'active'
          },
          {
            id: '2',
            userId: 'user2',
            startedAt: new Date(Date.now() - 3600000), // 1 hour ago
            lastMessage: 'Thank you for your order',
            status: 'completed'
          }
        ];
        setConversations(mockConversations);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch conversations',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [toast]);

  const handleViewConversation = (id: string) => {
    // TODO: Implement conversation view
    toast({
      title: 'View Conversation',
      description: `Viewing conversation ${id}`,
    });
  };

  const handleArchiveConversation = (id: string) => {
    // TODO: Implement conversation archive
    toast({
      title: 'Archive Conversation',
      description: `Archived conversation ${id}`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Conversations</h2>
        <Button>Export Data</Button>
      </div>

      <Card>
        <ScrollArea className="h-[600px]">
          <div className="p-4 space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No conversations found
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">
                      Conversation {conversation.id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {conversation.lastMessage}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Started: {conversation.startedAt.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewConversation(conversation.id)}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleArchiveConversation(conversation.id)}
                    >
                      Archive
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default AdminConversations; 