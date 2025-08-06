import { Student } from './types.ts';

export const studentsData: Student[] = [
    {
        id: 1,
        name: 'kulkarni naga sravani',
        study: 'first',
        lpi: { overall: 781, speed: 708, memory: 773, attention: 834, flexibility: 987, problemSolving: 401, math: 907, firstLpi: 749, bestLpi: 789 },
        percentiles: { overall: 32, speed: 27.7, problemSolving: 17.6, memory: 25.8, attention: 35.2, flexibility: 52.8, math: 49.7 },
        streaks: { current: 1, best: 5, history: [true, false, false, true, true, true, true] },
        gameRankings: [
            { rank: 1, name: 'Raindrops', score: 1494, iconColor: "bg-cyan-500" },
            { rank: 2, name: 'Memory Matrix', score: 1263, iconColor: "bg-red-500" },
            { rank: 3, name: 'Lost in Migration', score: 1262, iconColor: "bg-sky-600" },
        ],
        mostImprovedGames: [
            { name: 'Raindrops', lpiIncrease: 182, iconColor: "bg-cyan-500" },
            { name: 'Trouble Brewing', lpiIncrease: 120, iconColor: "bg-amber-500" },
            { name: 'Train of Thought', lpiIncrease: 92, iconColor: "bg-lime-500" },
        ]
    },
    {
        id: 2,
        name: 'syed arman',
        study: 'second',
        lpi: { overall: 1239, speed: 1284, memory: 1045, attention: 1624, flexibility: 1041, problemSolving: 634, math: 1116, firstLpi: 1100, bestLpi: 1250 },
        percentiles: { overall: 88, speed: 92.1, problemSolving: 60.5, memory: 78.3, attention: 95.0, flexibility: 81.2, math: 85.4 },
        streaks: { current: 12, best: 15, history: [true, true, true, true, false, true, true] },
        gameRankings: [
            { rank: 1, name: 'Eagle Eye', score: 1840, iconColor: "bg-indigo-500" },
            { rank: 2, name: 'Speed Match', score: 1755, iconColor: "bg-pink-500" },
            { rank: 3, name: 'Pinball Recall', score: 1500, iconColor: "bg-purple-500" },
        ],
        mostImprovedGames: [
            { name: 'Attention', lpiIncrease: 210, iconColor: "bg-indigo-500" },
            { name: 'Speed Match', lpiIncrease: 150, iconColor: "bg-pink-500" },
            { name: 'Flexibility Flow', lpiIncrease: 110, iconColor: "bg-green-500" },
        ]
    },
    {
        id: 3,
        name: 'karthikeya',
        study: 'first',
        lpi: { overall: 661, speed: 502, memory: 469, attention: 751, flexibility: 957, problemSolving: 373, math: 298, firstLpi: 600, bestLpi: 670 },
        percentiles: { overall: 25, speed: 18.2, problemSolving: 15.0, memory: 17.5, attention: 30.1, flexibility: 48.9, math: 12.3 },
        streaks: { current: 2, best: 4, history: [false, false, true, true, false, true, true] },
        gameRankings: [
            { rank: 1, name: 'Penguin Pursuit', score: 1100, iconColor: "bg-gray-400" },
            { rank: 2, name: 'Word Bubbles', score: 980, iconColor: "bg-teal-500" },
            { rank: 3, name: 'Color Match', score: 950, iconColor: "bg-orange-500" },
        ],
        mostImprovedGames: [
            { name: 'Flexibility', lpiIncrease: 88, iconColor: "bg-orange-500" },
            { name: 'Attention Grabber', lpiIncrease: 72, iconColor: "bg-teal-500" },
            { name: 'Problem Solving', lpiIncrease: 50, iconColor: "bg-rose-500" },
        ]
    },
    {
        id: 4,
        name: 'adarsh',
        study: 'second',
        lpi: { overall: 904, speed: 893, memory: 824, attention: 1051, flexibility: 891, problemSolving: 893, math: 1066, firstLpi: 850, bestLpi: 910 },
        percentiles: { overall: 65, speed: 68.4, problemSolving: 70.1, memory: 63.2, attention: 75.8, flexibility: 67.3, math: 79.9 },
        streaks: { current: 7, best: 7, history: [true, true, true, true, true, true, true] },
        gameRankings: [
            { rank: 1, name: 'Math Master', score: 1600, iconColor: "bg-blue-700" },
            { rank: 2, name: 'Logic Train', score: 1420, iconColor: "bg-emerald-500" },
            { rank: 3, name: 'Speed Drills', score: 1380, iconColor: "bg-fuchsia-500" },
        ],
        mostImprovedGames: [
            { name: 'Problem Solving', lpiIncrease: 125, iconColor: "bg-emerald-500" },
            { name: 'Math Master', lpiIncrease: 115, iconColor: "bg-blue-700" },
            { name: 'Memory Lane', lpiIncrease: 85, iconColor: "bg-violet-500" },
        ]
    },
    {
        id: 5,
        name: 'venkat k',
        study: 'first',
        lpi: { overall: 0, speed: 220, memory: 1147, attention: 304, flexibility: 210, problemSolving: 0, math: 1023, firstLpi: 0, bestLpi: 0 },
        percentiles: { overall: 0, speed: 5.6, problemSolving: 0, memory: 85.2, attention: 8.3, flexibility: 4.1, math: 77.0 },
        streaks: { current: 0, best: 2, history: [false, false, false, false, false, true, true] },
        gameRankings: [
            { rank: 1, name: 'Memory Match', score: 1800, iconColor: "bg-yellow-400" },
            { rank: 2, name: 'Math Blaster', score: 1500, iconColor: "bg-red-600" },
            { rank: 3, name: 'Pattern Recognition', score: 900, iconColor: "bg-green-600" },
        ],
        mostImprovedGames: [
            { name: 'Memory', lpiIncrease: 250, iconColor: "bg-yellow-400" },
            { name: 'Math', lpiIncrease: 180, iconColor: "bg-red-600" },
            { name: 'Attention Focus', lpiIncrease: 30, iconColor: "bg-blue-400" },
        ]
    }
];