-- Create messaging and calling tables
CREATE TABLE IF NOT EXISTS public.chat_rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    worker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    booking_id UUID NULL,
    service_title TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'blocked')),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customer_id, worker_id, booking_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'location', 'system', 'call_request', 'call_ended')),
    file_url TEXT NULL,
    file_name TEXT NULL,
    file_size INTEGER NULL,
    location_lat DECIMAL NULL,
    location_lng DECIMAL NULL,
    location_address TEXT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP WITH TIME ZONE NULL,
    reply_to_id UUID NULL REFERENCES public.messages(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.call_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    caller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    call_type TEXT NOT NULL CHECK (call_type IN ('voice', 'video')),
    status TEXT DEFAULT 'ringing' CHECK (status IN ('ringing', 'active', 'ended', 'missed', 'declined')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    answered_at TIMESTAMP WITH TIME ZONE NULL,
    ended_at TIMESTAMP WITH TIME ZONE NULL,
    duration_seconds INTEGER DEFAULT 0,
    end_reason TEXT NULL CHECK (end_reason IN ('completed', 'declined', 'missed', 'network_error', 'user_ended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.message_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction TEXT NOT NULL CHECK (reaction IN ('👍', '👎', '❤️', '😂', '😮', '😢', '😡')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(message_id, user_id, reaction)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_rooms_customer_id ON public.chat_rooms(customer_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_worker_id ON public.chat_rooms(worker_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_last_message_at ON public.chat_rooms(last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_chat_room_id ON public.messages(chat_room_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON public.messages(is_read);

CREATE INDEX IF NOT EXISTS idx_call_sessions_chat_room_id ON public.call_sessions(chat_room_id);
CREATE INDEX IF NOT EXISTS idx_call_sessions_caller_id ON public.call_sessions(caller_id);
CREATE INDEX IF NOT EXISTS idx_call_sessions_receiver_id ON public.call_sessions(receiver_id);
CREATE INDEX IF NOT EXISTS idx_call_sessions_status ON public.call_sessions(status);

-- Enable Row Level Security
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_rooms
CREATE POLICY "Users can view their own chat rooms" ON public.chat_rooms
    FOR SELECT USING (
        auth.uid() = customer_id OR 
        auth.uid() = worker_id
    );

CREATE POLICY "Users can create chat rooms" ON public.chat_rooms
    FOR INSERT WITH CHECK (
        auth.uid() = customer_id OR 
        auth.uid() = worker_id
    );

CREATE POLICY "Users can update their own chat rooms" ON public.chat_rooms
    FOR UPDATE USING (
        auth.uid() = customer_id OR 
        auth.uid() = worker_id
    );

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their chat rooms" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chat_rooms 
            WHERE id = chat_room_id 
            AND (customer_id = auth.uid() OR worker_id = auth.uid())
        )
    );

CREATE POLICY "Users can send messages in their chat rooms" ON public.messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.chat_rooms 
            WHERE id = chat_room_id 
            AND (customer_id = auth.uid() OR worker_id = auth.uid())
        )
    );

CREATE POLICY "Users can update their own messages" ON public.messages
    FOR UPDATE USING (sender_id = auth.uid());

-- RLS Policies for call_sessions
CREATE POLICY "Users can view their call sessions" ON public.call_sessions
    FOR SELECT USING (
        auth.uid() = caller_id OR 
        auth.uid() = receiver_id
    );

CREATE POLICY "Users can create call sessions" ON public.call_sessions
    FOR INSERT WITH CHECK (
        auth.uid() = caller_id
    );

CREATE POLICY "Users can update their call sessions" ON public.call_sessions
    FOR UPDATE USING (
        auth.uid() = caller_id OR 
        auth.uid() = receiver_id
    );

-- RLS Policies for message_reactions
CREATE POLICY "Users can view reactions in their chat rooms" ON public.message_reactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.messages m
            JOIN public.chat_rooms cr ON m.chat_room_id = cr.id
            WHERE m.id = message_id 
            AND (cr.customer_id = auth.uid() OR cr.worker_id = auth.uid())
        )
    );

CREATE POLICY "Users can add reactions" ON public.message_reactions
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.messages m
            JOIN public.chat_rooms cr ON m.chat_room_id = cr.id
            WHERE m.id = message_id 
            AND (cr.customer_id = auth.uid() OR cr.worker_id = auth.uid())
        )
    );

CREATE POLICY "Users can remove their own reactions" ON public.message_reactions
    FOR DELETE USING (user_id = auth.uid());

-- Functions to update timestamps
CREATE OR REPLACE FUNCTION update_chat_room_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.chat_rooms 
    SET last_message_at = NEW.created_at,
        updated_at = NOW()
    WHERE id = NEW.chat_room_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_chat_room_on_message
    AFTER INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_room_last_message();

-- Grant permissions
GRANT ALL ON public.chat_rooms TO authenticated;
GRANT ALL ON public.messages TO authenticated;
GRANT ALL ON public.call_sessions TO authenticated;
GRANT ALL ON public.message_reactions TO authenticated;

GRANT SELECT ON public.chat_rooms TO anon;
GRANT SELECT ON public.messages TO anon;
GRANT SELECT ON public.call_sessions TO anon;
GRANT SELECT ON public.message_reactions TO anon;
