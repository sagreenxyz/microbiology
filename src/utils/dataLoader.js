// Function to load chapter summary
export async function loadChapterSummary(subject, chapterNumber) {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}subjects/${subject}/${chapterNumber}/microbiology-summary-${chapterNumber}.md`);
    if (!response.ok) {
      throw new Error(`Failed to load summary: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error loading chapter summary:', error);
    return null;
  }
}

// Function to load chapter questions
export async function loadChapterQuestions(subject, chapterNumber) {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}subjects/${subject}/${chapterNumber}/microbiology-chapter-${chapterNumber}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load chapter questions: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading chapter questions:', error);
    return null;
  }
}

// Function to load quiz questions
export async function loadQuizQuestions(subject, chapterNumber) {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}subjects/${subject}/${chapterNumber}/microbiology-quiz-${chapterNumber}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load quiz questions: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading quiz questions:', error);
    return null;
  }
}

// Function to get all available subjects
export async function getAvailableSubjects() {
  // In a real application, this would be an API call
  // For now, we'll just return the hardcoded subjects
  return [
    {
      id: 'microbiology',
      name: 'Microbiology',
      description: 'Study of microorganisms, including bacteria, viruses, fungi, and parasites.',
      chapters: 26
    }
  ];
}

// Function to get chapter details
export async function getChapterDetails(subject, chapterNumber) {
  // In a real application, this would be an API call
  // For now, we'll just return some basic info based on the chapter number
  return {
    id: chapterNumber,
    number: parseInt(chapterNumber),
    title: `Chapter ${chapterNumber}`,
    hasQuestions: true,
    hasQuiz: true
  };
}