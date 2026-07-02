const db = require('./db');

const events = [
  {
    title: 'Intro to Python Workshop',
    description: 'A hands-on session covering Python basics: variables, loops, functions, and a small project to tie it together. No prior experience needed.',
    date: '2026-07-10',
    time: '14:00',
    location: 'Lab 3, Main Building',
    category: 'Workshop',
    capacity: 30
  },
  {
    title: 'Tech Career Fair',
    description: 'Meet recruiters from local tech companies, get resume feedback, and learn about internship opportunities for the upcoming year.',
    date: '2026-07-15',
    time: '10:00',
    location: 'Main Hall',
    category: 'Career',
    capacity: 200
  },
  {
    title: 'Cybersecurity 101: Ethical Hacking Basics',
    description: 'An introductory talk on penetration testing fundamentals, covering common vulnerabilities and how to responsibly report them.',
    date: '2026-07-18',
    time: '16:30',
    location: 'Lecture Hall B',
    category: 'Talk',
    capacity: 50
  },
  {
    title: 'Weekend Hackathon Kickoff',
    description: 'Form teams and start building. Prizes for best overall project, best design, and most creative use of the sponsor API.',
    date: '2026-07-25',
    time: '09:00',
    location: 'Innovation Center',
    category: 'Hackathon',
    capacity: 80
  },
  {
    title: 'Study Group: Applied Mathematics III',
    description: 'Peer study session covering ODEs, vector calculus, and eigenvalue methods ahead of the midterm.',
    date: '2026-07-08',
    time: '18:00',
    location: 'Library, Room 204',
    category: 'Study Group',
    capacity: 15
  }
];

const insert = db.prepare(`
  INSERT INTO events (title, description, date, time, location, category, capacity)
  VALUES (@title, @description, @date, @time, @location, @category, @capacity)
`);

for (const event of events) {
  insert.run(event);
}

console.log(`Seeded ${events.length} sample events.`);