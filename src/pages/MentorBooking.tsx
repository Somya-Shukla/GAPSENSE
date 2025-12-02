import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';
import MentorCard from '../components/MentorCard';
import { mockData } from '../utils/mockData';
import { Mentor } from '../utils/mockData';

const MentorBooking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mentorId = searchParams.get('mentor');
  const struggleId = searchParams.get('struggle');

  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [booked, setBooked] = useState(false);

  const mentors = mockData.getMentors();

  useEffect(() => {
    if (mentorId) {
      const mentor = mockData.getMentor(mentorId);
      if (mentor) setSelectedMentor(mentor);
    }
  }, [mentorId]);

  const handleBooking = () => {
    if (!selectedMentor || !selectedSlot) return;

    mockData.addBooking({
      mentorId: selectedMentor.id,
      mentorName: selectedMentor.name,
      slot: selectedSlot,
      anonymous,
      struggleId: struggleId || null
    });

    setBooked(true);
    setTimeout(() => {
      navigate('/profile');
    }, 2000);
  };

  if (booked) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card rounded-xl p-12 text-center"
        >
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold mb-2">Session Booked!</h2>
          <p className="text-gray-300">Redirecting to profile...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageHeader
          title="Book a Mentor Session"
          subtitle="Select a mentor and choose your preferred time slot"
        />

        <div className="space-y-6">
          {!selectedMentor ? (
            <Card>
              <h3 className="text-xl font-semibold mb-4">Select a Mentor</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {mentors.map((mentor) => (
                  <MentorCard
                    key={mentor.id}
                    mentor={mentor}
                    onSelect={() => setSelectedMentor(mentor)}
                  />
                ))}
              </div>
            </Card>
          ) : (
            <>
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">Selected Mentor</h3>
                    <p className="text-gray-300">{selectedMentor.name}</p>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedMentor(null)}>
                    Change
                  </Button>
                </div>
                <MentorCard mentor={selectedMentor} />
              </Card>

              <Card>
                <h3 className="text-xl font-semibold mb-4">Select Time Slot</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedMentor.timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-4 py-3 rounded-lg border transition-all ${
                        selectedSlot === slot
                          ? 'bg-crimson-accent/20 border-crimson-accent/50 text-white'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/30'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="anonymous-booking"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                    className="w-5 h-5 rounded bg-white/5 border-white/10 text-crimson-accent focus:ring-crimson-accent/50"
                  />
                  <label htmlFor="anonymous-booking" className="text-gray-300">
                    Book session anonymously
                  </label>
                </div>
              </Card>

              <div className="flex gap-4">
                <Button
                  variant="primary"
                  onClick={handleBooking}
                  disabled={!selectedSlot}
                  className="flex-1"
                >
                  Confirm Booking
                </Button>
                <Button variant="outline" onClick={() => navigate('/community')}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorBooking;

