function currentlyInfectedCalculator(cases, estimate) {
    return cases * estimate;
}

function infectionsByRequestedTimeCalculator(currentlyInfected, durationType, timeToElapse) {

    if (durationType === 'weeks') {
        timeToElapse * 7;
    } else if (durationType === 'months') {
        timeToElapse * 30;
    }

    const threeDaySets = timeToElapse / 3;

    return Math.floor(currentlyInfected * 2 ** threeDaySets);
}

function hospitalBedsByRequestedTimeCalculator(infections, totalBeds) {
    const availableBeds = 0.35 * totalBeds;
    const severeCases = 0.15 * infections;

    return Math.floor(availableBeds - severeCases);
}

function casesForICUByRequestedTimeCalculator(infections) {
    return Math.floor(0.5 * infections);
}

function casesForVentilatorsByRequestedTimeCalculator(infections) {
    return Math.floor(0.2 * infections);
}

function dollarsInFlightCalculator(infections, dailyIncomePopulation, dailyIncome, timeToElapse) {
    const dollarsInFlight = (infections * dailyIncomePopulation) * dailyIncome * timeToElapse;
    return dollarsInFlight;
}


const covid19ImpactEstimator = (data) => {
    const impact = {};
    const severeImpact = {};

    impact.currentlyInfected = currentlyInfectedCalculator(data.reportedCases, 10);
    severeImpact.currentlyInfected = currentlyInfectedCalculator(data.reportedCases, 50);

    impact.infectionsByRequestedTime = infectionsByRequestedTimeCalculator(impact.currentlyInfected, data.periodType, data.timeToElapse);
    severeImpact.infectionsByRequestedTime = infectionsByRequestedTimeCalculator(severeImpact.currentlyInfected, data.periodType, data.timeToElapse);

    impact.hospitalBedsByRequestedTime = hospitalBedsByRequestedTimeCalculator(impact.infectionsByRequestedTime, data.totalHospitalBeds);
    severeImpact.hospitalBedsByRequestedTime = hospitalBedsByRequestedTimeCalculator(severeImpact.infectionsByRequestedTime, data.totalHospitalBeds);

    impact.casesForICUByRequestedTime = casesForICUByRequestedTimeCalculator(impact.infectionsByRequestedTime);
    severeImpact.casesForICUByRequestedTime = casesForICUByRequestedTimeCalculator(severeImpact.infectionsByRequestedTime);

    impact.casesForVentilatorsByRequestedTime = casesForVentilatorsByRequestedTimeCalculator(impact.infectionsByRequestedTime);
    severeImpact.casesForVentilatorsByRequestedTime = casesForVentilatorsByRequestedTimeCalculator(severeImpact.infectionsByRequestedTime);

    impact.dollarsInFlight = dollarsInFlightCalculator(impact.infectionsByRequestedTime, data.region.avgDailyIncomePopulation, data.region.avgDailyIncomeInUSD, data.timeToElapse);
    severeImpact.dollarsInFlight = dollarsInFlightCalculator(severeImpact.infectionsByRequestedTime, data.region.avgDailyIncomePopulation, data.region.avgDailyIncomeInUSD, data.timeToElapse);

    return { data, impact, severeImpact };
}

export default covid19ImpactEstimator;