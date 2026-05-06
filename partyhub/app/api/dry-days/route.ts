import { NextResponse } from 'next/server';

// A hardcoded list of major upcoming Indian dry days.
// In a real production app, this could be fetched from a database or external government API.
const DRY_DAYS = [
  { date: '2026-01-26', name: 'Republic Day', location: 'Pan India' },
  { date: '2026-03-31', name: 'Mahavir Jayanti', location: 'Pan India' },
  { date: '2026-04-14', name: 'Ambedkar Jayanti', location: 'Pan India' },
  { date: '2026-05-01', name: 'Maharashtra Day', location: 'Maharashtra' },
  { date: '2026-05-26', name: 'Buddha Purnima', location: 'Pan India' },
  { date: '2026-08-15', name: 'Independence Day', location: 'Pan India' },
  { date: '2026-09-07', name: 'Ganesh Chaturthi', location: 'Maharashtra' },
  { date: '2026-10-02', name: 'Gandhi Jayanti', location: 'Pan India' },
  { date: '2026-10-20', name: 'Dussehra', location: 'Pan India' },
  { date: '2026-11-08', name: 'Diwali', location: 'Pan India' },
  { date: '2026-11-24', name: 'Guru Nanak Jayanti', location: 'Pan India' },
  
  // 2027 onwards
  { date: '2027-01-26', name: 'Republic Day', location: 'Pan India' },
  { date: '2027-05-01', name: 'Maharashtra Day', location: 'Maharashtra' },
  { date: '2027-08-15', name: 'Independence Day', location: 'Pan India' },
  { date: '2027-10-02', name: 'Gandhi Jayanti', location: 'Pan India' },
];

export async function GET() {
  const today = new Date();
  // Strip time from today to compare just dates
  today.setHours(0, 0, 0, 0);
  
  // Find the next upcoming dry day
  const upcoming = DRY_DAYS
    .filter(d => new Date(d.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  return NextResponse.json(upcoming || null);
}
