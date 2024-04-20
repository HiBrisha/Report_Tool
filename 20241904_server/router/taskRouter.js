// restricted.js
async function getRestrictedCounts(dbConfig,mssql) {

    try {
        // Connect to the database
        await mssql.connect(dbConfig);

        // Define your SQL queries
        const queries = {
            DT: {
                Restricted: [
                    {
                        Label: 'Thấp',
                        SQL: "SELECT COUNT(*) as Num FROM [CMW_iDB].[dbo].[UCV_DT] WHERE [PR_COMOS_MOBILE_WORKER_PROD_RESTRICTED] = 'A010' and PR_DELSTATUS>=0",
                    },
                    {
                        Label: 'Trung bình',
                        SQL: "SELECT COUNT(*) as Num FROM [CMW_iDB].[dbo].[UCV_DT] WHERE [PR_COMOS_MOBILE_WORKER_PROD_RESTRICTED] = 'A020' and PR_DELSTATUS>=0",
                    },
                    {
                        Label: 'Cao',
                        SQL: "SELECT COUNT(*) as Num FROM [CMW_iDB].[dbo].[UCV_DT] WHERE [PR_COMOS_MOBILE_WORKER_PROD_RESTRICTED] = 'A030' and PR_DELSTATUS>=0",
                    },
                    {
                        Label: 'Khác',
                        SQL: "SELECT COUNT(*) as Num FROM [CMW_iDB].[dbo].[UCV_DT] WHERE ([PR_COMOS_MOBILE_WORKER_PROD_RESTRICTED] not in ('A030','A020','A010') or [PR_COMOS_MOBILE_WORKER_PROD_RESTRICTED] is Null) and PR_DELSTATUS>=0",
                    }
                ],
                New: "SELECT COUNT(*) as Num FROM [CMW_iDB].[dbo].[UCV_DT] WHERE [PR_STATUS] = '1' and PR_DELSTATUS>=0",
                Inprogress: "SELECT COUNT(*) as Num FROM [CMW_iDB].[dbo].[UCV_DT] WHERE [PR_STATUS] = '6' and PR_DELSTATUS>=0",
                Completed: "SELECT COUNT(*) as Num FROM [CMW_iDB].[dbo].[UCV_DT] WHERE [PR_STATUS] = '5' and PR_DELSTATUS>=0",
                Others: "SELECT COUNT(*) as Num FROM [CMW_iDB].[dbo].[UCV_DT] WHERE ([PR_STATUS] not in ('5','6','1') or [PR_STATUS] is Null ) and PR_DELSTATUS>=0",
            },
            WR: {
                Restricted: [
                    {
                        Label: 'Thấp',
                        SQL: "SELECT COUNT(*) as Num FROM [CMW_iDB].[dbo].[UCV_WR] WHERE [PR_WORK_PRIORITY] = 'A030' and PR_DELSTATUS>=0",
                    },
                    {
                        Label: 'Trung bình',
                        SQL: "SELECT COUNT(*) as Num FROM [CMW_iDB].[dbo].[UCV_WR] WHERE [PR_WORK_PRIORITY] = 'A020' and PR_DELSTATUS>=0",
                    },
                    {
                        Label: 'Cao',
                        SQL: "SELECT COUNT(*) as Num FROM [CMW_iDB].[dbo].[UCV_WR] WHERE [PR_WORK_PRIORITY] = 'A010' and PR_DELSTATUS>=0",
                    },
                    {
                        Label: 'Khác',
                        SQL: "SELECT COUNT(*) as Num FROM [CMW_iDB].[dbo].[UCV_WR] WHERE ([PR_WORK_PRIORITY] not in ('A030','A020','A010') or [PR_WORK_PRIORITY] is Null) and PR_DELSTATUS>=0",
                    }
                ],
                New: "SELECT COUNT(*) as Num FROM [CMW_iDB].[dbo].[UCV_WR] WHERE [PR_STATE] = '1' and PR_DELSTATUS>=0",
                Inprogress: "SELECT COUNT(*) as Num FROM [CMW_iDB].[dbo].[UCV_WR] WHERE [PR_STATE] = '6' and PR_DELSTATUS>=0",
                Completed: "SELECT COUNT(*) as Num FROM [CMW_iDB].[dbo].[UCV_WR] WHERE [PR_STATE] = '5' and PR_DELSTATUS>=0",
                Others: "SELECT COUNT(*) as Num FROM [CMW_iDB].[dbo].[UCV_WR] WHERE ([PR_STATE] not in ('5','6','1') or [PR_STATE] is Null ) and PR_DELSTATUS>=0",
            },
            WO: {
                Restricted: [
                    {
                        Label: 'Thấp',
                        SQL: "SELECT COUNT(*) as Num FROM [CMW_iDB].[dbo].[UCV_WO] WHERE [PR_PRIORITY] = 'A030' and PR_DELSTATUS>=0",
                    },
                    {
                        Label: 'Trung bình',
                        SQL: "SELECT COUNT(*) as Num FROM [CMW_iDB].[dbo].[UCV_WO] WHERE [PR_PRIORITY] = 'A020' and PR_DELSTATUS>=0",
                    },
                    {
                        Label: 'Cao',
                        SQL: "SELECT COUNT(*) as Num FROM [CMW_iDB].[dbo].[UCV_WO] WHERE [PR_PRIORITY] = 'A010' and PR_DELSTATUS>=0",
                    },
                    {
                        Label: 'Khác',
                        SQL: "SELECT COUNT(*) as Num FROM [CMW_iDB].[dbo].[UCV_WO] WHERE ([PR_PRIORITY] not in ('A030','A020','A010') or [PR_PRIORITY] is Null) and PR_DELSTATUS>=0",
                    }
                ],
                New: "SELECT COUNT(*) as Num FROM [CMW_iDB].[dbo].[UCV_WO] WHERE [PR_STATE] = '@1' and PR_DELSTATUS>=0",
                Inprogress: "SELECT COUNT(*) as Num FROM [CMW_iDB].[dbo].[UCV_WO] WHERE [PR_STATE] = '@2' and PR_DELSTATUS>=0",
                Completed: "SELECT COUNT(*) as Num FROM [CMW_iDB].[dbo].[UCV_WO] WHERE [PR_STATE] = '@4' and PR_DELSTATUS>=0",
                Others: "SELECT COUNT(*) as Num FROM [CMW_iDB].[dbo].[UCV_WO] WHERE ([PR_STATE] not in ('@1','@2','@4') or [PR_STATE] is Null) and PR_DELSTATUS>=0",
            },
            KPI:{
                KPI_Data: `SELECT
                                FORMAT(CONVERT(date, [Date]), 'MM-dd') AS Date,
                                COUNT(CASE WHEN Label = 'DT' THEN 1 END) AS Num_DT,
                                COUNT(CASE WHEN Label = 'WR' THEN 1 END) AS Num_WR,
                                COUNT(CASE WHEN Label = 'WO' THEN 1 END) AS Num_WO
                            FROM
                                (
                                SELECT
                                    'DT' as Label,
                                    CONVERT(date, [PR_CTS]) AS Date
                                FROM
                                    [UCV_DT]
                                WHERE [PR_DELSTATUS] >= 0

                                UNION ALL

                                SELECT
                                    'WR' as Label,
                                    CONVERT(date, [PR_CTS]) AS Date
                                FROM
                                    [UCV_WR]
                                WHERE [PR_DELSTATUS] >= 0

                                UNION ALL

                                SELECT
                                    'WO' as Label,
                                    CONVERT(date, [PR_CTS]) AS Date
                                FROM
                                    [UCV_WO]
                                WHERE [PR_DELSTATUS] >= 0
                                ) AS AllData
                            GROUP BY
                                CONVERT(date, Date)`,
            },
            RANK:{
                RANK_Data: `SELECT TOP(5)
                            MAX(a.PR_ComosDescription_L0) AS EQ,
                            COUNT(*) AS NUM
                        FROM
                            [dbo].[UCV_EQ] a 
                        INNER JOIN
                            [UCV_DT] b ON b.PR_FREEPOINTER_01 = a.ID AND b.PR_DELSTATUS >= 0
                        GROUP BY
                            a.PR_ComosDescription_L0
                        ORDER BY
                            NUM DESC`,
            }

        };

        // Execute each query and gather the results
        const results = {};
        for (const category in queries) {
            results[category] = {};
            for (const queryType in queries[category]) {
                if (Array.isArray(queries[category][queryType])) {
                    results[category][queryType] = await Promise.all(queries[category][queryType].map(async (query) => {
                        const result = await mssql.query(query.SQL);
                        return { Label: query.Label, Num: result.recordset[0].Num };
                    }));
                } else if (category === 'KPI') {
                    const result = await mssql.query(queries[category][queryType]);
                    results[category] = result.recordset.map(item => [
                        item.Date,
                        item.Num_DT,
                        item.Num_WR,
                        item.Num_WO
                    ]);
                }else if (category === 'RANK') {
                    const result = await mssql.query(queries[category][queryType]);
                    results[category] = result.recordset.map(item => [
                        item.EQ,
                        item.NUM
                    ]);
                } else {
                    const result = await mssql.query(queries[category][queryType]);
                    results[category][queryType] = result.recordset[0].Num;
                }
            }
        }

        return results;
    } catch (error) {
        console.error(error);
        throw new Error('Error querying the database');
    } finally {
        // Close the database connection
        mssql.close();
    }
}

module.exports = { getRestrictedCounts };
