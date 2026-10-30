// Data transcribed from the team's research spreadsheet.
// Verify the report version and all figures before final submission.

const healthData = {
    stunting: {
        title: "Child Stunting",
        value: 26.8,
        headline: "27%",
        population: "Children under five.",
        definition:
            "Stunting is defined using height-for-age measurements. " +
            "The report defines it as a height-for-age z-score more than " +
            "2 standard deviations below the WHO reference median.",
        context:
            "The research sheet records rural stunting at 30% and " +
            "urban stunting at 19%. It also records a decline from " +
            "51% in 2005 to 33% in 2019–20 and 27% in 2025.",
        caption:
            "Exact table value: 26.8%. Headline figure rounded to 27%.",
        secondLabel: "Not stunted*"
    },

    vaccination: {
        title: "Childhood Vaccination",
        value: 94.2,
        headline: "94%",
        population: "Children aged 12–23 months.",
        definition:
            "Fully vaccinated with basic antigens means receiving " +
            "the specified BCG, polio, DPT-containing, and " +
            "measles-containing vaccine doses in the report.",
        context:
            "The research sheet records BCG at 98%, DPT3 at 97%, " +
            "OPV3 at 97%, and measles at 97%. Coverage under the " +
            "full national schedule is a different measure.",
        caption:
            "Exact table value: 94.2%. Headline figure rounded to 94%.",
        secondLabel: "Not fully vaccinated*"
    },

    anc: {
        title: "Antenatal Care (4+ Visits)",
        value: 77.5,
        headline: "78%",
        population:
            "Women aged 15–49 with a live birth or stillbirth " +
            "in the two years before the survey.",
        definition:
            "The percentage of women who had four or more " +
            "antenatal care visits for their most recent birth.",
        context:
            "The research sheet records 64% among women with no " +
            "education and 90% among women with more than secondary " +
            "education. Skilled-provider care is a separate indicator.",
        caption:
            "Exact table value: 77.5%. Headline figure rounded to 78%.",
        secondLabel: "Fewer than 4 visits*"
    },

    teenage: {
        title: "Teenage Pregnancy",
        value: 8.1,
        headline: "8%",
        population: "Women aged 15–19.",
        definition:
            "The percentage of women aged 15–19 who have ever " +
            "been pregnant, according to the report's definition.",
        context:
            "The research sheet records rural teenage pregnancy " +
            "at 9.0% and urban teenage pregnancy at 5.9%. It also " +
            "records differences by age.",
        caption:
            "Exact table value: 8.1%. Headline figure rounded to 8%.",
        secondLabel: "Not ever pregnant*"
    }
};

document.addEventListener("DOMContentLoaded", () => {

    const select = document.getElementById("indicatorSelect");
    const info = document.getElementById("indicatorInfo");
    const chartTitle = document.getElementById("chartTitle");
    const chartCaption = document.getElementById("chartCaption");
    const detailsButton = document.getElementById("detailsButton");
    const detailsPanel = document.getElementById("detailsPanel");
    const chartCanvas = document.getElementById("healthChart");

    const cards = [
        ...document.querySelectorAll(".indicator-card")
    ];

    // Check that the required HTML elements exist.
    if (
        !select ||
        !info ||
        !chartTitle ||
        !chartCaption ||
        !detailsButton ||
        !detailsPanel
    ) {
        console.error(
            "The health explorer is missing one or more required HTML elements."
        );

        return;
    }

    let healthChart = null;

    // Update the page when an indicator is selected.
    function showIndicator(key) {

        const item = healthData[key];

        if (!item) {
            return;
        }

        // Update the chart heading.
        chartTitle.textContent = item.title;

        // Update the percentage and population information.
        info.replaceChildren();

        const headline = document.createElement("strong");
        headline.textContent = item.headline;

        const population = document.createElement("p");
        population.textContent = item.population;

        info.append(headline, population);

        // Update the chart caption.
        chartCaption.textContent = item.caption;

        // Close the details panel when changing indicators.
        detailsPanel.hidden = true;
        detailsPanel.replaceChildren();

        detailsButton.textContent =
            "Show Definition and Context +";

        detailsButton.setAttribute("aria-expanded", "false");

        // Highlight the selected indicator card.
        cards.forEach(card => {

            const active =
                card.dataset.indicator === key;

            card.classList.toggle("is-active", active);

            card.setAttribute(
                "aria-pressed",
                String(active)
            );
        });

        // Display a message if Chart.js is unavailable.
        if (!chartCanvas || typeof Chart === "undefined") {

            const container =
                document.querySelector(".chart-container");

            if (container) {

                container.innerHTML =
                    '<p class="chart-fallback">' +
                    'The chart could not load. ' +
                    'Please check your internet connection and refresh the page. ' +
                    'The selected indicator information is still available.' +
                    '</p>';
            }

            return;
        }

        // Destroy the previous chart before creating a new one.
        if (healthChart) {
            healthChart.destroy();
            healthChart = null;
        }

        // Create the selected indicator chart.
        healthChart = new Chart(chartCanvas, {

            type: "bar",

            data: {
                labels: [
                    item.title,
                    item.secondLabel
                ],

                datasets: [
                    {
                        label: "Percentage",

                        data: [
                            item.value,
                            Number(
                                (100 - item.value).toFixed(1)
                            )
                        ],

                        backgroundColor: [
                            "#0FA3B1",
                            "#B5E2D3"
                        ],

                        borderColor: [
                            "#0FA3B1",
                            "#B5E2D3"
                        ],

                        borderRadius: 8,
                        borderSkipped: false,
                        barThickness: 38
                    }
                ]
            },

            options: {

                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,

                animation: {
                    duration: 450
                },

                plugins: {

                    legend: {
                        display: false
                    },

                    tooltip: {
                        callbacks: {

                            label: context => {
                                return (
                                    Number(context.raw).toFixed(1) + "%"
                                );
                            }

                        }
                    }
                },

                scales: {

                    x: {

                        min: 0,
                        max: 100,

                        ticks: {

                            color: "#1B3A57",

                            callback: value => {
                                return value + "%";
                            }
                        },

                        grid: {
                            color: "#e4edf0"
                        }
                    },

                    y: {

                        ticks: {
                            color: "#1B3A57"
                        },

                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Update the chart when the dropdown changes.
    select.addEventListener("change", () => {
        showIndicator(select.value);
    });

    // Make all four indicator cards clickable.
    cards.forEach(card => {

        card.addEventListener("click", () => {

            const key = card.dataset.indicator;

            if (!healthData[key]) {
                return;
            }

            // Update the dropdown.
            select.value = key;

            // Update the information and chart.
            showIndicator(key);

            // Move to the interactive explorer.
            const explorer =
                document.getElementById("explore");

            if (explorer) {

                explorer.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    // Show or hide the definition and context.
    detailsButton.addEventListener("click", () => {

        const item = healthData[select.value];

        if (!item) {
            return;
        }

        if (detailsPanel.hidden) {

            detailsPanel.replaceChildren();

            const definitionHeading =
                document.createElement("strong");

            definitionHeading.textContent = "Definition";

            const definitionText =
                document.createElement("p");

            definitionText.textContent = item.definition;

            const contextHeading =
                document.createElement("strong");

            contextHeading.textContent =
                "Context from the research sheet";

            const contextText =
                document.createElement("p");

            contextText.textContent = item.context;

            const note =
                document.createElement("small");

            note.textContent =
                "*The second bar is calculated as 100% minus the indicator value. " +
                "Confirm that the complementary category wording and percentage " +
                "are valid in the official report before submission.";

            detailsPanel.append(
                definitionHeading,
                definitionText,
                contextHeading,
                contextText,
                note
            );

            detailsPanel.hidden = false;

            detailsButton.textContent =
                "Hide Definition and Context −";

            detailsButton.setAttribute(
                "aria-expanded",
                "true"
            );

        } else {

            detailsPanel.hidden = true;

            detailsButton.textContent =
                "Show Definition and Context +";

            detailsButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    });

    // Show the first indicator when the website opens.
    showIndicator(select.value || "stunting");

});