document.addEventListener("DOMContentLoaded", () => {
    const promotionDatesList = document.getElementById("promotion-dates-list");

    // List of promotion dates
    const promotionDates = [
        "Australia Day, January 26th",
        "Republic Day, India, January 26th",
        "Valentine's Day, world, February 14th",
        "Kings Harald V's Day, Norway, February 21st",
        "International Women's Day, world, March 8th",
        "St. Patrick, world, March 17th",
        "Mother's Day, Ireland, March 19th",
        "Father's Day, Italy, Portugal, March 19th",
        "Ramadan Start, muslim, March 23rd",
        "Greek Independence Day, March 25th",
        "April Fools, world, April 1st",
        "Easter, world, April 20th",
        "Liberty Day, Portugal, April 25th",
        "King's Birthday, Netherlands, April 27th",
        "Mother's Day, Hungary, Portugal, Romania, May 7th",
        "Mother's Day, world, May 14th",
        "Mother's Day, Poland, May 26th",
        "Portugal Day, June 10th",
        "Father's Day, Canada, New Zealand, Czechia, June 19th",
        "Canada Day, July 1st",
        "Swiss National Day, August 1st",
        "Independence Day, India, August 15th",
        "Father’s Day (Australia, New Zealand), September 4th",
        "Halloween, world, October 31st",
        "Christmas, world, December 24th/25th",
        "New Year, world, December 31st"
    ];

    // Create two columns
    const leftColumn = document.createElement("div");
    const rightColumn = document.createElement("div");

    leftColumn.style.flex = "1";
    rightColumn.style.flex = "1";

    // Distribute dates evenly between columns
    promotionDates.forEach((date, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = date;
        if (index % 2 === 0) {
            leftColumn.appendChild(listItem);
        } else {
            rightColumn.appendChild(listItem);
        }
    });

    // Style the container
    promotionDatesList.style.display = "flex";
    promotionDatesList.style.gap = "20px";

    // Append columns to the container
    promotionDatesList.appendChild(leftColumn);
    promotionDatesList.appendChild(rightColumn);
});