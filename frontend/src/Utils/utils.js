/* Parses date string and converts it to minutes
n.b: input format must be "hh:mm"
* */

function formattedTimeToMinutesParser(formattedTimeString) {
    let minutes = 0;
    const arr = formattedTimeString.split(":");

    minutes += Number(arr[0]) * 60;
    minutes += Number(arr[1]);

    return minutes;
}

export default formattedTimeToMinutesParser;