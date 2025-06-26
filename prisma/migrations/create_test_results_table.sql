CREATE TABLE public.test_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    wpm INT NOT NULL,
    accuracy DECIMAL(5, 2) NOT NULL,
    duration_seconds INT NOT NULL,
    typed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own test results." ON public.test_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own test results." ON public.test_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);
