import React, { useState, useEffect, useCallback } from 'react';
import type { Student } from '../types.ts';
import { fetchStudentData, triggerStatsRefresh } from '../services/apiService.ts';

import {
    LogoutIcon, InfoIcon, SparklesIcon, BoltIcon, BrainIcon, EyeIcon, ShuffleIcon,
    PuzzleIcon, CalculatorIcon, ArrowUpIcon, GameIcon, RefreshIcon
} from './Icons.tsx';
import { studentsData as staticStudentsData } from '../data.ts';

// Sub-component: Reusable Card
interface InfoCardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
}
const InfoCard: React.FC<InfoCardProps> = ({ title, children, className, icon }) => (
    <div className={`bg-gray-800 border border-gray-700/50 rounded-xl shadow-lg p-4 sm:p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                {icon}
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">{title}</h3>
            </div>
            <InfoIcon className="w-5 h-5 text-gray-500 cursor-pointer" />
        </div>
        <div>{children}</div>
    </div>
);

// Sub-component: Stat Bar
interface StatBarProps {
    label: string;
    value: number;
    maxValue: number;
    isPercentile?: boolean;
}
const StatBar: React.FC<StatBarProps> = ({ label, value, maxValue, isPercentile = false }) => {
    const widthPercentage = (value / maxValue) * 100;
    return (
        <div className="flex items-center text-sm mb-3">
            <p className="w-1/3 text-gray-300">{label}</p>
            <div className="w-2/3 flex items-center">
                <div className="w-full bg-gray-700 rounded-full h-2.5 mr-3">
                    <div
                        className="bg-yellow-400 h-2.5 rounded-full"
                        style={{ width: `${widthPercentage}%` }}
                    ></div>
                </div>
                <span className="font-semibold text-white w-12 text-right">
                    {isPercentile ? `${value}%` : value}
                </span>
            </div>
        </div>
    );
};

// Sub-component: Comparison Bar Chart
type StatKey = keyof Omit<Student['lpi'], 'firstLpi' | 'bestLpi'>;

interface ComparisonBarChartProps {
    students: Student[];
    selectedStudentId: number;
    statKey: StatKey;
    statLabel: string;
}

const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({ students, selectedStudentId, statKey, statLabel }) => {
    const getStatValue = (student: Student, key: StatKey): number => {
        return student.lpi[key] || 0;
    };

    const chartData = students.map(s => ({
        id: s.id,
        name: s.name,
        value: getStatValue(s, statKey),
        isSelected: s.id === selectedStudentId,
    })).sort((a, b) => b.value - a.value);

    const maxValue = Math.max(...chartData.map(d => d.value), 1);

    return (
        <div className="mt-4 pt-4 border-t border-gray-700/50">
            <h4 className="text-lg font-semibold text-white mb-8 text-center">
                {statLabel} Comparison
            </h4>
            <div className="flex justify-between items-end h-64 w-full gap-2 sm:gap-4 px-2 mt-4">
                {chartData.map(data => (
                    <div key={data.id} className="relative flex flex-col justify-end items-center h-full flex-1 group">
                        <p className="absolute -top-6 text-sm font-bold text-white drop-shadow-md">{data.value}</p>
                        <div
                            className={`w-full rounded-t-md transition-all duration-300 ease-in-out ${
                                data.isSelected
                                    ? 'bg-yellow-400 shadow-lg shadow-yellow-400/20'
                                    : 'bg-gray-600 group-hover:bg-gray-500'
                            }`}
                            style={{ height: `${(data.value / maxValue) * 100}%` }}
                        ></div>
                        <p className={`mt-2 text-xs text-center w-full break-words capitalize ${
                            data.isSelected
                                ? 'font-bold text-yellow-300'
                                : 'text-gray-400 group-hover:text-white'
                        }`}>
                            {data.name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};


// Sub-component: Student Details View
interface StudentDetailProps {
    student: Student;
    allStudents: Student[];
    onBack: () => void;
}
const StudentDetailView: React.FC<StudentDetailProps> = ({ student, allStudents, onBack }) => {
    const [activeStat, setActiveStat] = useState<StatKey>('overall');
    
    const lpiCategories = [
        { label: 'Overall LPI', value: student.lpi.overall, max: 2000 },
        { label: 'Speed', value: student.lpi.speed, max: 2000 },
        { label: 'Memory', value: student.lpi.memory, max: 2000 },
        { label: 'Attention', value: student.lpi.attention, max: 2000 },
        { label: 'Flexibility', value: student.lpi.flexibility, max: 2000 },
        { label: 'Problem Solving', value: student.lpi.problemSolving, max: 2000 },
        { label: 'Math', value: student.lpi.math, max: 2000 },
    ];

    const percentileCategories = [
        { label: 'Overall', value: student.percentiles.overall },
        { label: 'Speed', value: student.percentiles.speed },
        { label: 'Problem Solving', value: student.percentiles.problemSolving },
        { label: 'Memory', value: student.percentiles.memory },
        { label: 'Attention', value: student.percentiles.attention },
        { label: 'Flexibility', value: student.percentiles.flexibility },
        { label: 'Math', value: student.percentiles.math },
    ];

    const statTabs: { key: StatKey, label: string }[] = [
        { key: 'overall', label: 'Overall LPI' },
        { key: 'speed', label: 'Speed' },
        { key: 'memory', label: 'Memory' },
        { key: 'attention', label: 'Attention' },
        { key: 'flexibility', label: 'Flexibility' },
        { key: 'problemSolving', label: 'Problem Solving' },
        { key: 'math', label: 'Math' },
    ];
    
    // Filter peers from the same study year for comparison
    const peersInSameYear = allStudents.filter(s => s.study === student.study);
    const studyYearText = student.study === 'first' ? '1st Year' : '2nd Year';
    
    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
            <button onClick={onBack} className="mb-6 bg-gray-700 text-yellow-400 font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                &larr; Back to All Stats
            </button>
            <h2 className="text-3xl font-bold mb-6 capitalize text-white">{student.name}'s Stats</h2>



            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1 */}
                <div className="lg:col-span-1 space-y-6">
                    <InfoCard title="Cognitive performance index" icon={<BoltIcon className="text-yellow-400 w-5 h-5" />}>
                       {lpiCategories.map(cat => <StatBar key={cat.label} label={cat.label} value={cat.value} maxValue={cat.max}/>)}
                        <div className="border-t border-gray-700 mt-4 pt-4 flex justify-around text-center text-sm">
                            <div>
                                <p className="text-gray-400">First LPI</p>
                                <p className="font-bold text-lg text-white">{student.lpi.firstLpi}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Best LPI</p>
                                <p className="font-bold text-lg text-yellow-400">{student.lpi.bestLpi}</p>
                            </div>
                        </div>
                    </InfoCard>
                    <InfoCard title="How I Compare" icon={<PuzzleIcon className="text-yellow-400 w-5 h-5" />}>
                        {percentileCategories.map(cat => <StatBar key={cat.label} label={cat.label} value={cat.value} maxValue={100} isPercentile={true}/>)}
                    </InfoCard>
                </div>

                {/* Column 2 */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoCard title="Training Streaks" icon={<BrainIcon className="text-yellow-400 w-5 h-5" />}>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-4xl font-bold text-white">{student.streaks.current}</p>
                                    <p className="text-gray-400 text-sm">Current Streak</p>
                                </div>
                                 <div>
                                    <p className="text-4xl font-bold text-white">{student.streaks.best}</p>
                                    <p className="text-gray-400 text-sm">Best Streak</p>
                                </div>
                            </div>
                            <div className="flex justify-center gap-1.5 mt-4">
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, i) => (
                                    <div key={day} className="text-center">
                                        <p className="text-xs text-gray-500 mb-1">{day}</p>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${student.streaks.history[i] ? 'bg-yellow-400' : 'bg-gray-700'}`}>
                                            {student.streaks.history[i] && <BoltIcon className="w-4 h-4 text-gray-900" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </InfoCard>

                        <InfoCard title="Most Improved Games" icon={<EyeIcon className="text-yellow-400 w-5 h-5" />}>
                           {student.mostImprovedGames.map((game, index) => (
                               <div key={index} className="flex items-center justify-between mb-3 last:mb-0">
                                   <div className="flex items-center">
                                       <GameIcon color={game.iconColor} />
                                       <div className="ml-3">
                                           <p className="font-semibold text-white">{game.name}</p>
                                           <p className="text-xs text-gray-400">LPI Increase: {game.lpiIncrease}</p>
                                       </div>
                                   </div>
                                   <ArrowUpIcon />
                               </div>
                           ))}
                           <button className="text-yellow-400 w-full text-right mt-4 text-sm font-bold">VIEW ALL &rarr;</button>
                        </InfoCard>
                    </div>
                    
                    <InfoCard title="Game Rankings" icon={<ShuffleIcon className="text-yellow-400 w-5 h-5" />}>
                        {student.gameRankings.map((game, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg even:bg-gray-700/50">
                                <div className="flex items-center">
                                    <span className="font-bold text-gray-400 text-lg w-8">{game.rank}</span>
                                    <GameIcon color={game.iconColor} />
                                    <p className="font-semibold text-white ml-4">{game.name}</p>
                                </div>
                                <p className="font-bold text-yellow-400 text-lg">{game.score}</p>
                            </div>
                        ))}
                        <button className="text-yellow-400 w-full text-right mt-4 text-sm font-bold">VIEW ALL &rarr;</button>
                    </InfoCard>
                </div>
            </div>

            <div className="mt-6">
                <InfoCard title="Peer Comparison" icon={<PuzzleIcon className="text-yellow-400 w-5 h-5" />}>
                     <div className="mb-4">
                        <p className="text-gray-300 text-sm">
                            See how {student.name.split(' ')[0]}'s skills stack up against other Inter {studyYearText} players. Select a category to see the comparison.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {statTabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveStat(tab.key)}
                                className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                                    activeStat === tab.key
                                    ? 'bg-yellow-400 text-gray-900'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                     <ComparisonBarChart
                        students={peersInSameYear}
                        selectedStudentId={student.id}
                        statKey={activeStat}
                        statLabel={statTabs.find(t => t.key === activeStat)?.label || ''}
                    />
                </InfoCard>
            </div>
        </div>
    );
};


// Sub-component: Students Table View
interface StatsTableProps {
    students: Student[];
    onSelectStudent: (student: Student) => void;
    onRefresh: () => void;
    isRefreshing: boolean;
    activeYear: 'first' | 'second';
    onYearChange: (year: 'first' | 'second') => void;
}
const StatsTableView: React.FC<StatsTableProps> = ({ students, onSelectStudent, onRefresh, isRefreshing, activeYear, onYearChange }) => (
    <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-2">
                <button
                    onClick={() => onYearChange('first')}
                    className={`px-4 py-2 text-lg font-bold rounded-lg transition-colors ${
                        activeYear === 'first'
                        ? 'bg-yellow-400 text-gray-900 shadow-md shadow-yellow-400/20'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    Inter 1st Year
                </button>
                <button
                    onClick={() => onYearChange('second')}
                    className={`px-4 py-2 text-lg font-bold rounded-lg transition-colors ${
                        activeYear === 'second'
                        ? 'bg-yellow-400 text-gray-900 shadow-md shadow-yellow-400/20'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    Inter 2nd Year
                </button>
            </div>
            <button
                onClick={onRefresh}
                disabled="disabled"
                className="flex items-center justify-center gap-2 bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-500 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                aria-live="polite"
            >
                {isRefreshing ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Refreshing...</span>
                    </>
                ) : (
                    <>
                        <RefreshIcon className="w-5 h-5" />
                        <span>Refresh Stats</span>
                    </>
                )}
            </button>
        </div>
        <div className="bg-gray-800 border border-gray-700/50 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-yellow-400 uppercase bg-gray-700/50">
                        <tr>
                            {['User', 'Overall LPI', 'Problem Solving', 'Speed', 'Memory', 'Attention', 'Flexibility', 'Math', ''].map(h => (
                                <th key={h} scope="col" className="px-6 py-3 whitespace-nowrap">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 ? (
                            students.map((student) => (
                                <tr key={student.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white capitalize whitespace-nowrap">{student.name}</td>
                                    <td className="px-6 py-4">{student.lpi.overall || '-'}</td>
                                    <td className="px-6 py-4">{student.lpi.problemSolving || '-'}</td>
                                    <td className="px-6 py-4">{student.lpi.speed || '-'}</td>
                                    <td className="px-6 py-4">{student.lpi.memory || '-'}</td>
                                    <td className="px-6 py-4">{student.lpi.attention || '-'}</td>
                                    <td className="px-6 py-4">{student.lpi.flexibility || '-'}</td>
                                    <td className="px-6 py-4">{student.lpi.math || '-'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => onSelectStudent(student)} className="font-medium text-yellow-400 hover:text-yellow-300 whitespace-nowrap">View Details</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="text-center py-8 text-gray-400">No student data available for this year.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);


// Main Dashboard Component
interface DashboardProps {
    onLogout: () => void;
}
const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [activeYear, setActiveYear] = useState<'first' | 'second'>('first');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchStudentData();
            setStudents(data);
        } catch (err) {
            setError("Failed to load live data. Displaying cached mock data as a fallback.");
            console.error(err);
             // Use the statically imported data for fallback
            setStudents(staticStudentsData);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleRefresh = useCallback(() => {
        if (isRefreshing) return;
        
        setError(null);
        setIsRefreshing(true);
        console.log('Starting refresh...');

        // Start the refresh process
        const timeoutId = triggerStatsRefresh(
            // Loading state handler
            (isLoading) => {
                setIsRefreshing(isLoading);
                console.log('Loading state changed to:', isLoading);
            },
            // Data update handler
            (newData) => {
                setStudents(newData);
                console.log('Data updated successfully');
            }
        );

        // Cleanup function for when component unmounts
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            setIsRefreshing(false);
        };
    }, [isRefreshing]);

    const handleSelectStudent = (student: Student) => {
        setSelectedStudent(student);
    };

    const handleBack = () => {
        setSelectedStudent(null);
    };
    
    const renderContent = () => {
        // Show loader only on initial load when there's no data yet
        if (isLoading && students.length === 0) {
            return (
                <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                    <div className="text-center">
                        <SparklesIcon className="w-12 h-12 text-yellow-400 mx-auto animate-pulse" />
                        <p className="mt-4 text-xl text-gray-300">Loading Player Stats...</p>
                    </div>
                </div>
            );
        }
    
        if (selectedStudent) {
            return <StudentDetailView student={selectedStudent} allStudents={students} onBack={handleBack} />
        }
        
        const filteredStudents = students.filter(student => student.study === activeYear);

        return <StatsTableView 
            students={filteredStudents} 
            onSelectStudent={handleSelectStudent} 
            onRefresh={handleRefresh} 
            isRefreshing={isRefreshing}
            activeYear={activeYear}
            onYearChange={setActiveYear}
        />
    }

    return (
        <div className="min-h-screen">
            <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10 w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 max-w-[2000px] mx-auto w-full">
                        <div className="flex-shrink-0 flex items-center gap-3">
                            <img src="/IACG.png" alt="IACG Logo" className="h-10 w-auto" />
                            <span className="text-xl font-bold text-white tracking-wider">IACG Students Game Stats</span>
                        </div>
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-2 bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors ml-auto"
                        >
                            <LogoutIcon />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>
            <main>
                {error && (
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                        <div className="bg-red-900/50 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg flex justify-between items-center">
                            <span>{error}</span>
                             <button onClick={() => setError(null)} className="font-bold text-xl ml-4">&times;</button>
                        </div>
                    </div>
                )}
                {renderContent()}
            </main>
        </div>
    );
};

export default Dashboard;
