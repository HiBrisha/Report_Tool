const queryCMD=(date,domain,data)=>{
    const queryExcute = {
        ACDC: `SELECT p.sTagName,
                        IIF(p.iTime = 0, 24, p.iTime) AS iTime,
                        p.iDate,
                        rValue AS Value,
                        EditedValue,
                        state
                    FROM [XHQDB].[XHQDB].dbo.[ProcessLog_Daily] p
                    FULL OUTER JOIN DCS_iDB.DCS.[EditedValue] e 
                        ON p.sTagName = e.sTagName
                        AND p.iDate = e.iDate
                        AND p.iTime = e.iTime
                    WHERE p.iTime % 2 = 0
                    AND p.sTagName IN ('3_TD91_phaA_out', '3_TD91_phaB_out', '3_TD91_phaC_out', '3_TD92_phaA_out', '3_TD92_phaB_out', '3_TD92_phaC_out', '3_TD43_phaA_out', '3_TD43_phaB_out', '3_TD43_phaC_out')
                    AND CAST(dateadd(hour, -1, dtDate) AS date) = '${date}'`,
        TDD:`SELECT p.sTagName,
                p.iDate,
                IIF(p.iTime = 0, 24, p.iTime) AS iTime,
                rValue AS Value,
                EditedValue,
                state
            FROM [XHQDB].[XHQDB].dbo.[ProcessLog_Daily] p
            FULL OUTER JOIN DCS_iDB.DCS.[EditedValue] e 
                ON p.sTagName = e.sTagName
                AND p.iDate = e.iDate
                AND p.iTime = e.iTime
            WHERE 
                p.sTagName IN ('1_TE91_phaA_out','1_TE91_phaB_out','1_TE91_phaC_out','1_IPB1_phaA_out','1_IPB1_phaB_out','1_IPB1_phaC_out',
                            '1_IPB2_phaA_out','1_IPB2_phaB_out','1_IPB2_phaC_out','1_IPB3_phaA_out','1_IPB3_phaB_out','1_IPB3_phaC_out','1_IPB4_phaA_out',
                            '1_IPB4_phaB_out','1_IPB4_phaC_out','2_TE92_phaA_out','2_TE92_phaB_out','2_TE92_phaC_out','2_IPB1_phaA_out','2_IPB1_phaB_out',
                            '2_IPB1_phaC_out','2_IPB2_phaA_out','2_IPB2_phaB_out','2_IPB2_phaC_out','2_IPB3_phaA_out','2_IPB3_phaB_out','2_IPB3_phaC_out',
                            '2_IPB4_phaA_out','2_IPB4_phaB_out','2_IPB4_phaC_out','U1L_AI0007.PV','U2L_AI0007.PV') 
                AND CAST(DATEADD(hour, -1, dtDate) AS DATE) = '${date}'`,
        T220:`SELECT 
                    CASE 
                        WHEN p.sTagName IN ('SYL_AI0004.PV', 'SYL_AI0004.PV', 'SYL_AI0005.PV') THEN 'EXTRACT_01'
                        WHEN p.sTagName IN ('SYL_AI0013.PV', 'SYL_AI0014.PV', 'SYL_AI0015.PV') THEN 'EXTRACT_02'
                        ELSE p.sTagName
                    END AS sTagName,
                    CONVERT(int, FORMAT(dtDate, 'yyyyMMdd')) AS iDate,
                    IIF(p.iTime = 0, 24, p.iTime) AS iTime,
                    MAX(p.rValue) AS Value,
                    e.EditedValue,
                    e.state
                FROM [XHQDB].[XHQDB].dbo.[ProcessLog_Daily] p
                FULL OUTER JOIN DCS_iDB.DCS.[EditedValue] e 
                    ON p.sTagName = e.sTagName
                    AND p.iDate = e.iDate
                    AND p.iTime = e.iTime
                WHERE 
                    p.sTagName IN ('SYL_AI0004.PV', 'SYL_AI0004.PV', 'SYL_AI0005.PV', 'SYL_AI0013.PV', 'SYL_AI0014.PV', 'SYL_AI0015.PV'
                    ,'SYL_AI0007.PV', 'SYL_AI0008.PV', 'SYL_AI0016.PV', 'SYL_AI0017.PV','SYL_AI0004.PV', 'SYL_AI0004.PV'
                    , 'SYL_AI0005.PV','SYL_AI0013.PV', 'SYL_AI0014.PV', 'SYL_AI0015.PV')
                    AND CAST(DATEADD(hour, -1, dtDate) AS date) = '${date}'
                GROUP BY 
                    CASE 
                        WHEN p.sTagName IN ('SYL_AI0004.PV', 'SYL_AI0004.PV', 'SYL_AI0005.PV') THEN 'EXTRACT_01'
                        WHEN p.sTagName IN ('SYL_AI0013.PV', 'SYL_AI0014.PV', 'SYL_AI0015.PV') THEN 'EXTRACT_02'
                        ELSE p.sTagName
                    END,
                    dtDate,
                    e.EditedValue,
                    e.state,
                    IIF(p.iTime = 0, 24, p.iTime);
                `,
        TSVH_H1:`SELECT 
                    CASE WHEN p.sTagName IN ('U1C_DI0355.PV', 'U1C_DI0356.PV') THEN 'a'
                        WHEN p.sTagName IN ('U1C_DI0281.PV', 'U1C_DI0280.PV') THEN 'b'
                        WHEN p.sTagName IN ('U1C_DI0279.PV', 'U1C_DI0278.PV') THEN 'c'
                        WHEN p.sTagName IN ('U1C_DI0283.PV', 'U1C_DI0282.PV') THEN 'd'
                        WHEN p.sTagName IN ('U1C_DI0273.PV', 'U1C_DI0274.PV') THEN 'e'
                        WHEN p.sTagName IN ('U1L_AI0028.PV', 'U1L_AI0029.PV') THEN 'f'
                        WHEN p.sTagName IN ('U1L_RTD0026.PV', 'U1L_RTD0027.PV') THEN 'g'
                        WHEN p.sTagName IN ('U1C_DI0357.PV', 'U1C_DI0358.PV') THEN 'h'
                        ELSE p.sTagName
                    END AS sTagName,
                    p.iDate,
                    IIF(p.iTime = 0, 24, p.iTime) AS iTime,
                    AVG(p.[rValue]) as Value,
                    e.EditedValue,
                    e.state
                FROM [XHQDB].[XHQDB].dbo.[ProcessLog_Daily] p
                FULL OUTER JOIN DCS_iDB.DCS.[EditedValue] e
                ON  p.sTagName = e.sTagName
                    AND p.iDate = e.iDate
                    AND p.iTime = e.iTime
                WHERE
                    CAST(DATEADD(hour, -1, p.dtDate) AS date) = '${date}' AND (
                    (p.sTagName IN ('U1L_AI0010.PV', 'U1L_AI0011.PV', 'U1L_AI0012.PV', 'U1L_RTD0025.PV', 'U1L_AI0020.PV', 'U1L_AI0013.PV', 'SYL_AI0025.PV', 'U1L_RTD0021.PV', 'U1C_DI0364.PV', 'U1C_DI0363.PV', 'U1L_RTD0014.PV'))
                    OR (p.sTagName IN ('U1C_DI0355.PV', 'U1C_DI0356.PV'))
                    OR (p.sTagName IN ('U1C_DI0281.PV', 'U1C_DI0280.PV'))
                    OR (p.sTagName IN ('U1C_DI0279.PV', 'U1C_DI0278.PV'))
                    OR (p.sTagName IN ('U1C_DI0283.PV', 'U1C_DI0282.PV'))
                    OR (p.sTagName IN ('U1C_DI0273.PV', 'U1C_DI0274.PV'))
                    OR (p.sTagName IN ('U1L_AI0028.PV', 'U1L_AI0029.PV'))
                    OR (p.sTagName IN ('U1L_RTD0026.PV', 'U1L_RTD0027.PV'))
                    OR (p.sTagName IN ('U1C_DI0357.PV', 'U1C_DI0358.PV')))
                GROUP BY
                    CASE 
                        WHEN p.sTagName IN ('U1C_DI0355.PV', 'U1C_DI0356.PV') THEN 'a'
                        WHEN p.sTagName IN ('U1C_DI0281.PV', 'U1C_DI0280.PV') THEN 'b'
                        WHEN p.sTagName IN ('U1C_DI0279.PV', 'U1C_DI0278.PV') THEN 'c'
                        WHEN p.sTagName IN ('U1C_DI0283.PV', 'U1C_DI0282.PV') THEN 'd'
                        WHEN p.sTagName IN ('U1C_DI0273.PV', 'U1C_DI0274.PV') THEN 'e'
                        WHEN p.sTagName IN ('U1L_AI0028.PV', 'U1L_AI0029.PV') THEN 'f'
                        WHEN p.sTagName IN ('U1L_RTD0026.PV', 'U1L_RTD0027.PV') THEN 'g'
                        WHEN p.sTagName IN ('U1C_DI0357.PV', 'U1C_DI0358.PV') THEN 'h'
                        ELSE p.sTagName
                    END,
                    p.iDate,
                    p.iTime,
                    e.EditedValue,
                    e.state`,
        TSVH_H2:`SELECT 
                    CASE WHEN p.sTagName IN ('U2C_DI0355.PV', 'U2C_DI0356.PV') THEN 'a'
                        WHEN p.sTagName IN ('U2C_DI0281.PV', 'U2C_DI0280.PV') THEN 'b'
                        WHEN p.sTagName IN ('U2C_DI0279.PV', 'U2C_DI0278.PV') THEN 'c'
                        WHEN p.sTagName IN ('U2C_DI0283.PV', 'U2C_DI0282.PV') THEN 'd'
                        WHEN p.sTagName IN ('U2C_DI0273.PV', 'U2C_DI0274.PV') THEN 'e'
                        WHEN p.sTagName IN ('U2L_AI0028.PV', 'U2L_AI0029.PV') THEN 'f'
                        WHEN p.sTagName IN ('U2L_RTD0026.PV', 'U2L_RTD0027.PV') THEN 'g'
                        WHEN p.sTagName IN ('U2C_DI0357.PV', 'U2C_DI0358.PV') THEN 'h'
                        ELSE p.sTagName
                    END AS sTagName,
                    p.iDate,
                    IIF(p.iTime = 0, 24, p.iTime) AS iTime,
                    AVG(p.[rValue]) as Value,
                    e.EditedValue,
                    e.state
                FROM [XHQDB].[XHQDB].dbo.[ProcessLog_Daily] p
                FULL OUTER JOIN DCS_iDB.DCS.[EditedValue] e 
                ON  p.sTagName = e.sTagName
                    AND p.iDate = e.iDate
                    AND p.iTime = e.iTime
                WHERE
                    CAST(DATEADD(hour, -1, p.dtDate) AS date) = '${date}' AND (
                    (p.sTagName IN ('U2L_AI0010.PV', 'U2L_AI0011.PV', 'U2L_AI0012.PV', 'U2L_RTD0025.PV', 'U2L_AI0020.PV', 'U2L_AI0013.PV', 'SYL_AI0025.PV', 'U2L_RTD0021.PV', 'U2C_DI0364.PV', 'U2C_DI0363.PV', 'U2L_RTD0014.PV'))
                    OR (p.sTagName IN ('U2C_DI0355.PV', 'U2C_DI0356.PV'))
                    OR (p.sTagName IN ('U2C_DI0281.PV', 'U2C_DI0280.PV'))
                    OR (p.sTagName IN ('U2C_DI0279.PV', 'U2C_DI0278.PV'))
                    OR (p.sTagName IN ('U2C_DI0283.PV', 'U2C_DI0282.PV'))
                    OR (p.sTagName IN ('U2C_DI0273.PV', 'U2C_DI0274.PV'))
                    OR (p.sTagName IN ('U2L_AI0028.PV', 'U2L_AI0029.PV'))
                    OR (p.sTagName IN ('U2L_RTD0026.PV', 'U2L_RTD0027.PV'))
                    OR (p.sTagName IN ('U2C_DI0357.PV', 'U2C_DI0358.PV')))
                GROUP BY
                    CASE 
                        WHEN p.sTagName IN ('U2C_DI0355.PV', 'U2C_DI0356.PV') THEN 'a'
                        WHEN p.sTagName IN ('U2C_DI0281.PV', 'U2C_DI0280.PV') THEN 'b'
                        WHEN p.sTagName IN ('U2C_DI0279.PV', 'U2C_DI0278.PV') THEN 'c'
                        WHEN p.sTagName IN ('U2C_DI0283.PV', 'U2C_DI0282.PV') THEN 'd'
                        WHEN p.sTagName IN ('U2C_DI0273.PV', 'U2C_DI0274.PV') THEN 'e'
                        WHEN p.sTagName IN ('U2L_AI0028.PV', 'U2L_AI0029.PV') THEN 'f'
                        WHEN p.sTagName IN ('U2L_RTD0026.PV', 'U2L_RTD0027.PV') THEN 'g'
                        WHEN p.sTagName IN ('U2C_DI0357.PV', 'U2C_DI0358.PV') THEN 'h'
                        ELSE p.sTagName
                    END,
                    p.iDate,
                    p.iTime,
                    e.EditedValue,
                    e.state`,
        MERGE_DATA:`MERGE INTO DCS_iDB.DCS.[EditedValue] AS target
                    USING (VALUES 
                        ('${data.sTagName}', ${data.iTime}, ${data.iDate}, ${data.EditedValue},${data.state})
                    ) AS source (sTagName, iTime, iDate, EditedValue,state)
                    ON (target.sTagName = source.sTagName AND target.iDate = source.iDate AND target.iTime = source.iTime) 
                    WHEN MATCHED THEN 
                        UPDATE SET target.EditedValue = source.EditedValue, target.state=source.state
                    WHEN NOT MATCHED THEN 
                        INSERT (sTagName, iTime, iDate, EditedValue,state) 
                        VALUES (source.sTagName, source.iTime, source.iDate, source.EditedValue,source.state);`,
        SOCKET:`SELECT TOP(3)
                    [Value], 
                    TagName, 
                    [Description], 
                    CASE 
                        WHEN Unit IS NULL THEN ''
                        ELSE Unit
                    END AS Unit
                FROM 
                    [XHQDB].[XHQDB].[dbo].[vItems] a
                INNER JOIN 
                    [DCS_iDB].[dbo].[DCS_Tag_CBM] b ON a.TagName = b.[TAG_DCS]
                WHERE b.[Mã thiết bị] = '`
    }
    
    return queryExcute[domain]
}

module.exports={queryCMD};