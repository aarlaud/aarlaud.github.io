const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("assets");

    eleventyConfig.addCollection("article", function(collectionApi) {
        return collectionApi.getFilteredByGlob("articles/**/*.md");
    });

    eleventyConfig.addFilter("date", (dateObj, format) => {
        const dt = typeof dateObj === "string"
            ? DateTime.fromISO(dateObj)
            : DateTime.fromJSDate(dateObj);
        return dt.toFormat(format || "yyyy-MM-dd");
    });


};
