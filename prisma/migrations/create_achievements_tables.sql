CREATE TABLE public.achievements (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    threshold INT,
    type TEXT NOT NULL
);

CREATE TABLE public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id TEXT REFERENCES public.achievements(id) ON DELETE CASCADE,
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements." ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements." ON public.user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert initial achievements
INSERT INTO public.achievements (id, name, description, type, threshold) VALUES
('first_test', 'First Test Complete', 'Complete your very first typing test.', 'first_test', NULL),
('wpm_50', 'Speed Demon I', 'Achieve a Net WPM of 50 or higher.', 'wpm', 50),
('wpm_100', 'Speed Demon II', 'Achieve a Net WPM of 100 or higher.', 'wpm', 100);
