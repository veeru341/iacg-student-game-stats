import { Student } from '../types.ts';

const API_URL = 'https://iacg-lumosity-games-backend-production.up.railway.app/api/results';
const REFRESH_API_URL = 'https://iacg-lumosity-games-backend-production.up.railway.app/api/lumosity-stats';

const gameIconColors = [
  "bg-cyan-500", "bg-red-500", "bg-sky-600", "bg-amber-500", "bg-lime-500",
  "bg-indigo-500", "bg-pink-500", "bg-purple-500", "bg-gray-400", "bg-teal-500",
  "bg-orange-500", "bg-blue-700", "bg-emerald-500", "bg-fuchsia-500", "bg-violet-500",
  "bg-yellow-400", "bg-green-600", "bg-rose-500"
];
let colorIndex = 0;
const getNextColor = () => {
    const color = gameIconColors[colorIndex % gameIconColors.length];
    colorIndex++;
    return color;
};

const parseNumber = (val: string | number | undefined): number => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
        const num = parseInt(val, 10);
        return isNaN(num) ? 0 : num;
    }
    return 0;
};

const parsePercent = (val: string | undefined): number => {
    if (!val) return 0;
    return parseFloat(val.replace('%', '')) || 0;
};

const transformApiDataToStudents = (apiData: any[]): Student[] => {
    if (!Array.isArray(apiData)) {
        console.error("API data is not an array:", apiData);
        return [];
    }
    
    // Reset color index for each transformation to maintain consistency
    colorIndex = 0;

    return apiData.map((rawStudent: any, index: number): Student => {
        const lpiByArea = rawStudent.lpi?.byArea || {};
        
        // Find the first 'firstLpi' value available in the areas, as there is no overall 'firstLpi'
        const firstLpiValues = Object.values(lpiByArea).map((area: any) => area.first).filter(v => v);
        const firstLpi = firstLpiValues.length > 0 ? parseNumber(firstLpiValues[0]) : 0;
        
        const problemSolvingLpi = lpiByArea['problem-solving']?.current;
        const problemSolvingPercentile = rawStudent.percentiles?.['problem-solving'];

        return {
            id: index + 1,
            name: (rawStudent.summary?.user || 'Unknown').toLowerCase(),
            study: rawStudent.accountInfo?.study === 'second' ? 'second' : 'first',
            lpi: {
                overall: parseNumber(rawStudent.lpi?.overall),
                speed: parseNumber(lpiByArea.speed?.current),
                memory: parseNumber(lpiByArea.memory?.current),
                attention: parseNumber(lpiByArea.attention?.current),
                flexibility: parseNumber(lpiByArea.flexibility?.current),
                problemSolving: parseNumber(problemSolvingLpi),
                math: parseNumber(lpiByArea.math?.current),
                firstLpi: firstLpi,
                bestLpi: parseNumber(rawStudent.lpi?.best),
            },
            percentiles: {
                overall: 0, // Not available in the new API response
                speed: parsePercent(rawStudent.percentiles?.speed),
                problemSolving: parsePercent(problemSolvingPercentile),
                memory: parsePercent(rawStudent.percentiles?.memory),
                attention: parsePercent(rawStudent.percentiles?.attention),
                flexibility: parsePercent(rawStudent.percentiles?.flexibility),
                math: parsePercent(rawStudent.percentiles?.math),
            },
            streaks: {
                current: parseNumber(rawStudent.streaks?.current),
                best: parseNumber(rawStudent.streaks?.best),
                history: Array(7).fill(false), // History data is not available in the new API
            },
            gameRankings: (rawStudent.rankings?.topGames || []).map((game: any) => ({
                rank: game.rank,
                name: game.game.replace(/-/g, ' '),
                score: game.lpi,
                iconColor: getNextColor(),
            })),
            mostImprovedGames: (rawStudent.rankings?.mostImproved || []).map((game: any) => ({
                name: game.game.replace(/-/g, ' '),
                lpiIncrease: game.improvement,
                iconColor: getNextColor(),
            })),
        };
    });
};

export const triggerStatsRefresh = (
    setIsLoading?: (loading: boolean) => void,
    onDataUpdate?: (data: Student[]) => void
) => {
    // Start the timer
    console.log('Starting 2.5 minute timer...');
    
    // First hit the refresh API without waiting
    fetch(REFRESH_API_URL).catch(error => {
        console.warn('Initial refresh API call failed:', error);
        // Continue even if this fails
    });
    
    const timeoutId = setTimeout(async () => {
        try {
            console.log('Timer complete, fetching updated results...');
            const updatedData = await fetchStudentData();
            if (onDataUpdate) onDataUpdate(updatedData);
        } catch (error) {
            console.error("Error fetching results:", error);
        } finally {
            // Always ensure loading state is turned off
            if (setIsLoading) {
                setIsLoading(false);
                console.log('Loading state turned off');
            }
        }
    }, 150 * 1000); // 150 seconds = 2.5 minutes

    // Return cleanup function
    return timeoutId;
};

export const fetchStudentData = async (): Promise<Student[]> => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const apiResponse = await response.json();
        
        // The API returns an object with a 'success' flag and a 'data' property containing the student array.
        if (apiResponse && apiResponse.success && Array.isArray(apiResponse.data)) {
            return transformApiDataToStudents(apiResponse.data);
        }
        
        // If the structure is not as expected or success is false, throw an error.
        console.error("Invalid API response:", apiResponse);
        throw new Error('Invalid data format from API.');
    } catch (error) {
        console.error("Failed to fetch or process student data:", error);
        // Re-throw the error to be handled by the UI component
        throw error;
    }
};
