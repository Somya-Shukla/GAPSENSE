export const generateTags = (description: string, category: string): string[] => {
  const tags: string[] = [];
  const lowerDesc = description.toLowerCase();

  // Category-based tags
  if (category === 'technical') {
    if (lowerDesc.includes('react')) tags.push('react');
    if (lowerDesc.includes('javascript') || lowerDesc.includes('js')) tags.push('javascript');
    if (lowerDesc.includes('python')) tags.push('python');
    if (lowerDesc.includes('database') || lowerDesc.includes('sql')) tags.push('database');
    if (lowerDesc.includes('api')) tags.push('api');
    if (lowerDesc.includes('git')) tags.push('git');
    if (lowerDesc.includes('docker')) tags.push('docker');
    if (lowerDesc.includes('algorithm') || lowerDesc.includes('complexity')) tags.push('algorithms');
  }

  if (category === 'academic') {
    if (lowerDesc.includes('assignment') || lowerDesc.includes('homework')) tags.push('assignments');
    if (lowerDesc.includes('exam') || lowerDesc.includes('test')) tags.push('exams');
    if (lowerDesc.includes('study') || lowerDesc.includes('studying')) tags.push('study-strategies');
    if (lowerDesc.includes('time') || lowerDesc.includes('schedule')) tags.push('time-management');
  }

  if (category === 'career') {
    if (lowerDesc.includes('resume') || lowerDesc.includes('cv')) tags.push('resume');
    if (lowerDesc.includes('interview')) tags.push('interviews');
    if (lowerDesc.includes('job') || lowerDesc.includes('offer')) tags.push('job-search');
    if (lowerDesc.includes('network')) tags.push('networking');
  }

  if (category === 'mental health') {
    if (lowerDesc.includes('anxiety') || lowerDesc.includes('anxious')) tags.push('anxiety');
    if (lowerDesc.includes('stress') || lowerDesc.includes('stressed')) tags.push('stress');
    if (lowerDesc.includes('isolat') || lowerDesc.includes('lonely')) tags.push('loneliness');
    if (lowerDesc.includes('confident') || lowerDesc.includes('doubt')) tags.push('confidence');
  }

  // Common tags
  if (lowerDesc.includes('help') || lowerDesc.includes('stuck')) tags.push('help-needed');
  if (lowerDesc.includes('urgent') || lowerDesc.includes('asap')) tags.push('urgent');

  return tags.length > 0 ? tags : [category];
};

