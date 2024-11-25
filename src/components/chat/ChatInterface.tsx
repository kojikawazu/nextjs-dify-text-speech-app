'use client';

import { useState } from 'react';
import { Send, User, Bot } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
// shadcn/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
// types
import { Message } from '@/types/types';
// components
import Avatar from '@/components/avatar/Avatar';
import { useChat } from '@/hooks/use-chat';
import MyCanvas3D from '../avatar/avatar3D/MyCanvas3D';

interface ChatInterfaceProps {
    user: SupabaseUser | null;
}

/**
 * チャットインターフェイス
 * @param user ユーザー
 * @returns JSX.Element
 */
const ChatInterface = ({ user }: ChatInterfaceProps) => {
    // メッセージ
    const [messages, setMessages] = useState<Message[]>([]);
    // 入力
    const [input, setInput] = useState('');
    // ローディング
    const [isLoading, setIsLoading] = useState(false);
    // 音声合成中かどうか
    const [isSpeaking, setIsSpeaking] = useState(false);
    // 3Dアバター
    const [is3D, setIs3D] = useState(false);
    // チャット(hooks)
    const { sendMessage } = useChat();

    /**
     * 送信
     */
    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now(),
            text: input,
            sender: 'user',
        };

        // メッセージを追加
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // AIにメッセージを送信
            const reply = await sendMessage(input, user);
            // AIのメッセージを追加
            const aiMessage: Message = {
                id: Date.now() + 1,
                text: reply,
                sender: 'ai',
            };

            setMessages((prev) => [...prev, aiMessage]);
            speakMessage(reply);
        } catch (error) {
            console.error('Failed to get AI response:', error);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * 音声合成
     * @param text テキスト
     */
    const speakMessage = (text: string) => {
        if ('speechSynthesis' in window) {
            // 音声合成のインスタンスを作成
            const utterance = new SpeechSynthesisUtterance(text);
            // 言語を日本語に設定
            utterance.lang = 'ja-JP';
            // アニメーションのトリガーを設定 (例: リップシンク)
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            // 音声合成を実行
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-8 h-[calc(100vh-12rem)]">
            {/* アバター */}
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex-1 flex items-center justify-center">
                    {is3D ? (
                        <MyCanvas3D isSpeaking={isSpeaking} />
                    ) : (
                        <Avatar isAnimating={isLoading} />
                    )}
                </div>
                <Toggle pressed={is3D} onPressedChange={setIs3D} className="w-auto gap-2">
                    <span className="text-sm">3Dモード: {is3D ? 'ON' : 'OFF'}</span>
                </Toggle>
            </div>

            {/* チャット */}
            <div className="flex flex-col">
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 border rounded-lg">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${
                                message.sender === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                        >
                            {/* アイコン */}
                            <div className="w-8 h-8 mr-2 rounded-full overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
                                {message.sender === 'user' ? (
                                    <User className="w-5 h-5" />
                                ) : (
                                    <Bot className="w-5 h-5" />
                                )}
                            </div>

                            {/** メッセージ */}
                            <div
                                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                    message.sender === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted'
                                }`}
                            >
                                {message.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 入力 */}
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="メッセージを入力..."
                        className="flex-1"
                        data-testid="message-input"
                        disabled={isLoading}
                    />
                    <Button onClick={handleSend} disabled={isLoading} data-testid="send-button">
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
