/* Parses date string and converts it to minutes
n.b: input format must be "hh:mm"
* */

function formattedTimeToMinutesParser(formattedTimeString) {
    let minutes = 0;
    formattedTimeString.split(":");

    minutes += formattedTimeString[0] * 60
    minutes += formattedTimeString[1];

    return minutes;
}

export default formattedTimeToMinutesParser;