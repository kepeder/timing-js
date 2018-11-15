/**
 * Class TimelyIntegrator
 *
 * @since 0.0.1
 */
new class TimelyIntegrator
{
    /**
     * Method constructor
     *
     * @since 0.0.1
     */
    constructor()
    {
        let config = require('./config.json');

        let type = 'ACTIVITY';

        process.argv.forEach(function (val) {
            if (val === '--projects') {
                type = 'PROJECTS';
            }

            if (val === '--all') {
                config.sync_type = 'ALL';
            }
        });

        let name = '';

        this.db = require('better-sqlite3')('/Users/' + name + '/Library/Application\ Support/info.eurocomp.Timing2/SQLite.db');

        this._payload = [];

        this.processActivities();
    };

    /**
     *
     */
    processActivities()
    {
        let query = "SELECT a.startDate, a.endDate, a.id, a.projectID, a.title, b.title AS projectName, c.title AS rootProjectName, c.id AS rootProjectId FROM TaskActivity a ";
        query += "INNER JOIN Project b ON a.projectID = b.id ";
        query += "LEFT JOIN Project c ON b.parentID = c.id ";
        query += "ORDER BY startDate DESC";

        let results = this.db.prepare(query).all();
        let length = results.length;

        for (let i = 0; i < length; ++i) {
            // Calculate time.
            results[i].startDate = new Date(results[i].startDate * 1000);
            results[i].endDate = new Date(results[i].endDate * 1000);
            results[i].seconds = (results[i].endDate.getTime() - results[i].startDate.getTime()) / 1000;

            console.log(results[i]);
            return;
            if (config.bulk.enabled) {
                if (this._payload.length >= config.bulk.size) {
                    this.sendBulk();
                }

                this._payload.push(results[i]);
            } else {

            }
        }
    };

    /**
     *
     */
    sendBulk()
    {
        let config = require('./config.json');
    };
};