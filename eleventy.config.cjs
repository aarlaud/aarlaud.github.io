const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("assets");

    eleventyConfig.addCollection("article", function(collectionApi) {
        return collectionApi
            .getFilteredByGlob("articles/**/*.md")
            .sort((a, b) => {
                const aTime = DateTime.fromJSDate(a.date).toMillis();
                const bTime = DateTime.fromJSDate(b.date).toMillis();
                if (bTime !== aTime) return bTime - aTime;
                return b.inputPath.localeCompare(a.inputPath);
            });
    });

    eleventyConfig.addFilter("date", (dateObj, format) => {
        const dt = typeof dateObj === "string"
            ? DateTime.fromISO(dateObj)
            : DateTime.fromJSDate(dateObj);
        return dt.toFormat(format || "yyyy-MM-dd");
    });


};
