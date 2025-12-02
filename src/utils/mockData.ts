import strugglesData from '../data/struggles.json';
import mentorsData from '../data/mentors.json';

export interface Struggle {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  tags: string[];
  timestamp: string;
  anonymous: boolean;
  userId: string;
  status?: string;
}

export interface Mentor {
  id: string;
  name: string;
  email: string;
  expertise: string[];
  specializations: string[];
  rating: number;
  sessionsCompleted: number;
  bio: string;
  availability: string[];
  timeSlots: string[];
}

let struggles: Struggle[] = [...strugglesData as Struggle[]];
let mentors: Mentor[] = [...mentorsData as Mentor[]];
let bookings: any[] = [];
let bookmarkedStruggles: string[] = []; // Array of struggle IDs

export const mockData = {
  getStruggles: (): Struggle[] => {
    return [...struggles];
  },

  getStruggle: (id: string): Struggle | undefined => {
    return struggles.find(s => s.id === id);
  },

  addStruggle: (struggle: Omit<Struggle, 'id' | 'timestamp' | 'status'>): Struggle => {
    const newStruggle: Struggle = {
      ...struggle,
      id: `struggle_${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    struggles.push(newStruggle);
    return newStruggle;
  },

  getMentors: (): Mentor[] => {
    return [...mentors];
  },

  getMentor: (id: string): Mentor | undefined => {
    return mentors.find(m => m.id === id);
  },

  getMentorsByCategory: (category: string): Mentor[] => {
    return mentors.filter(m => m.expertise.includes(category));
  },

  addBooking: (booking: any): void => {
    bookings.push({
      ...booking,
      id: `booking_${Date.now()}`,
      createdAt: new Date().toISOString()
    });
  },

  getBookings: (): any[] => {
    return [...bookings];
  },

  updateStruggleStatus: (id: string, status: string): void => {
    const struggle = struggles.find(s => s.id === id);
    if (struggle) {
      struggle.status = status;
    }
  },

  // Analytics helpers
  getCategoryCounts: (): Record<string, number> => {
    const counts: Record<string, number> = {};
    struggles.forEach(s => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  },

  getSeverityCounts: (): Record<string, number> => {
    const counts: Record<string, number> = {};
    struggles.forEach(s => {
      counts[s.severity] = (counts[s.severity] || 0) + 1;
    });
    return counts;
  },

  getTimelineData: (): { date: string; count: number }[] => {
    const dateMap: Record<string, number> = {};
    struggles.forEach(s => {
      const date = s.timestamp.split('T')[0];
      dateMap[date] = (dateMap[date] || 0) + 1;
    });
    return Object.entries(dateMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },

  getMostCommonStruggle: (): string => {
    const categoryCounts = mockData.getCategoryCounts();
    return Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  },

  getFastestGrowingCategory: (): string => {
    // Simple mock - return most common for now
    return mockData.getMostCommonStruggle();
  },

  getMostActiveTime: (): string => {
    // Mock - return a time range
    return '14:00-16:00';
  },

  // Bookmark functions
  bookmarkStruggle: (struggleId: string): void => {
    if (!bookmarkedStruggles.includes(struggleId)) {
      bookmarkedStruggles.push(struggleId);
    }
  },

  unbookmarkStruggle: (struggleId: string): void => {
    bookmarkedStruggles = bookmarkedStruggles.filter(id => id !== struggleId);
  },

  isBookmarked: (struggleId: string): boolean => {
    return bookmarkedStruggles.includes(struggleId);
  },

  getBookmarkedStruggles: (): Struggle[] => {
    return struggles.filter(s => bookmarkedStruggles.includes(s.id));
  },

  flagStruggle: (id: string): void => {
    const struggle = struggles.find(s => s.id === id);
    if (struggle) {
      struggle.status = 'flagged';
    }
  }
};

