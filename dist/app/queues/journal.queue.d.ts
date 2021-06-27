import Bull from 'bull';
declare const journalQueue: Bull.Queue<any>;
declare const addJournal: (data: any) => void;
export { addJournal, journalQueue };
//# sourceMappingURL=journal.queue.d.ts.map