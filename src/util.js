// This is a utility file not a component
export const sortData = (data) => {
    const sortedData = [...data]; // Copy data on to new array
    
    // compares a to b and then wants -1 or 1 as comparator
    sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));

    return sortedData; 
}