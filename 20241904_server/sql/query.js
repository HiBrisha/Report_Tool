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
                    CASE WHEN p.sTagName IN ('U1C_DI0355.PV', 'U1C_DI0356.PV') THEN 'EXTRACT_01'
                        WHEN p.sTagName IN ('U1C_DI0281.PV', 'U1C_DI0280.PV') THEN 'EXTRACT_02'
                        WHEN p.sTagName IN ('U1C_DI0279.PV', 'U1C_DI0278.PV') THEN 'EXTRACT_03'
                        WHEN p.sTagName IN ('U1C_DI0283.PV', 'U1C_DI0282.PV') THEN 'EXTRACT_04'
                        WHEN p.sTagName IN ('U1C_DI0273.PV', 'U1C_DI0274.PV') THEN 'EXTRACT_05'
                        WHEN p.sTagName IN ('U1L_AI0028.PV', 'U1L_AI0029.PV') THEN 'EXTRACT_06'
                        WHEN p.sTagName IN ('U1L_RTD0026.PV', 'U1L_RTD0027.PV') THEN 'EXTRACT_07'
                        WHEN p.sTagName IN ('U1C_DI0357.PV', 'U1C_DI0358.PV') THEN 'EXTRACT_08'
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
                    CASE WHEN p.sTagName IN ('U1C_DI0355.PV', 'U1C_DI0356.PV') THEN 'EXTRACT_01'
                        WHEN p.sTagName IN ('U1C_DI0281.PV', 'U1C_DI0280.PV') THEN 'EXTRACT_02'
                        WHEN p.sTagName IN ('U1C_DI0279.PV', 'U1C_DI0278.PV') THEN 'EXTRACT_03'
                        WHEN p.sTagName IN ('U1C_DI0283.PV', 'U1C_DI0282.PV') THEN 'EXTRACT_04'
                        WHEN p.sTagName IN ('U1C_DI0273.PV', 'U1C_DI0274.PV') THEN 'EXTRACT_05'
                        WHEN p.sTagName IN ('U1L_AI0028.PV', 'U1L_AI0029.PV') THEN 'EXTRACT_06'
                        WHEN p.sTagName IN ('U1L_RTD0026.PV', 'U1L_RTD0027.PV') THEN 'EXTRACT_07'
                        WHEN p.sTagName IN ('U1C_DI0357.PV', 'U1C_DI0358.PV') THEN 'EXTRACT_08'
                        ELSE p.sTagName
                    END,
                    p.iDate,
                    p.iTime,
                    e.EditedValue,
                    e.state`,
        TSVH_H2:`SELECT 
                    CASE WHEN p.sTagName IN ('U2C_DI0355.PV', 'U2C_DI0356.PV') THEN 'EXTRACT_01'
                        WHEN p.sTagName IN ('U2C_DI0281.PV', 'U2C_DI0280.PV') THEN 'EXTRACT_02'
                        WHEN p.sTagName IN ('U2C_DI0279.PV', 'U2C_DI0278.PV') THEN 'EXTRACT_03'
                        WHEN p.sTagName IN ('U2C_DI0283.PV', 'U2C_DI0282.PV') THEN 'EXTRACT_04'
                        WHEN p.sTagName IN ('U2C_DI0273.PV', 'U2C_DI0274.PV') THEN 'EXTRACT_05'
                        WHEN p.sTagName IN ('U2L_AI0028.PV', 'U2L_AI0029.PV') THEN 'EXTRACT_06'
                        WHEN p.sTagName IN ('U2L_RTD0026.PV', 'U2L_RTD0027.PV') THEN 'EXTRACT_07'
                        WHEN p.sTagName IN ('U2C_DI0357.PV', 'U2C_DI0358.PV') THEN 'EXTRACT_08'
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
                    CASE WHEN p.sTagName IN ('U2C_DI0355.PV', 'U2C_DI0356.PV') THEN 'EXTRACT_01'
                        WHEN p.sTagName IN ('U2C_DI0281.PV', 'U2C_DI0280.PV') THEN 'EXTRACT_02'
                        WHEN p.sTagName IN ('U2C_DI0279.PV', 'U2C_DI0278.PV') THEN 'EXTRACT_03'
                        WHEN p.sTagName IN ('U2C_DI0283.PV', 'U2C_DI0282.PV') THEN 'EXTRACT_04'
                        WHEN p.sTagName IN ('U2C_DI0273.PV', 'U2C_DI0274.PV') THEN 'EXTRACT_05'
                        WHEN p.sTagName IN ('U2L_AI0028.PV', 'U2L_AI0029.PV') THEN 'EXTRACT_06'
                        WHEN p.sTagName IN ('U2L_RTD0026.PV', 'U2L_RTD0027.PV') THEN 'EXTRACT_07'
                        WHEN p.sTagName IN ('U2C_DI0357.PV', 'U2C_DI0358.PV') THEN 'EXTRACT_08'
                        ELSE p.sTagName
                    END,
                    p.iDate,
                    p.iTime,
                    e.EditedValue,
                    e.state`,
        TSVHD_H1:`SELECT 
                    CASE WHEN p.sTagName IN ('U1L_AI0004.PV', 'U1L_AI0005.PV','U1L_AI0006.PV') THEN 'EXTRACT_01'
                        WHEN p.sTagName IN ('U1L_AI0001.PV', 'U1L_AI0002.PV','U1L_AI0003.PV') THEN 'EXTRACT_02'
                        WHEN p.sTagName IN ('U1L_AI0035.PV', 'U1L_AI0036.PV', 'U1L_AI0037.PV', 'U1L_AI0038.PV', 'U1L_AI0039.PV', 'U1L_AI0040.PV', 'U1L_AI0041.PV', 'U1L_AI0042.PV',
                        'U1L_AI0043.PV', 'U1L_AI0044.PV', 'U1L_AI0045.PV', 'U1L_AI0046.PV','U1L_AI0047.PV', 'U1L_AI0034.PV', 'U1L_RTD0017.PV') THEN 'EXTRACT_03'
                        WHEN p.sTagName IN ('U1L_RTD0023.PV', 'U1L_RTD0015.PV') THEN 'EXTRACT_04'
                        WHEN p.sTagName IN ('U1L_AI0016.PV', 'U1L_AI0023.PV', 'U1L_AI0024.PV', 'U1L_AI0030.PV', 'U1L_AI0032.PV','U1L_AI0033.PV', 'U1L_AI0048.PV', 'UL_AI0031.PV', 
                        'U1L_AI0021.PV', 'U1L_AI0022.PV','U1L_RTD0013.PV') THEN 'EXTRACT_05'
                        WHEN p.sTagName IN ('U1C_DI0145', 'U1C_DI0146') THEN 'EXTRACT_06'
                        WHEN p.sTagName IN ('1_T1_oil_phaA_out', '1_T1_oil_phaA_out','1_T1_oil_phaC_out') THEN 'EXTRACT_07'
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
                    (p.sTagName IN ('U1L_RTD0007.PV', 'U1L_RTD0008.PV', 'U1L_RTD0009.PV', 'U1L_RTD0010.PV', 'U1L_RTD0011.PV', 'U1L_RTD0012.PV', 
                    'U1L_AI0007.PV', 'U1L_AI0008.PV', 'U1C_PAI0003', 'U1L_AI0013.PV', 'U1L_AI0014.PV','SYL_AI0025.PV','U1L_AI0010.PV','U1L_AI0026.PV','U1L_AI0025.PV',
                    'U1L_AI0027.PV','U1L_RTD0001.PV','U1L_RTD0002.PV','U1L_RTD0003.PV','U1L_RTD0005.PV','U1L_RTD0006.PV','U1L_RTD0007.PV','U1L_RTD0008.PV','U1L_RTD0009.PV',
                    'U1L_RTD0010.PV','U1L_RTD0011.PV','U1L_RTD0012.PV','U1L_RTD0014.PV','U1L_RTD0018.PV','U1L_RTD0019.PV','U1C_DI0273','U1C_DI0274','U1C_DI0142'))
                    OR (p.sTagName IN ('U1L_AI0004.PV', 'U1L_AI0005.PV','U1L_AI0006.PV'))
                    OR (p.sTagName IN ('U1L_AI0001.PV', 'U1L_AI0002.PV','U1L_AI0003.PV'))
                    OR (p.sTagName IN ('U1L_AI0035.PV', 'U1L_AI0036.PV', 'U1L_AI0037.PV', 'U1L_AI0038.PV', 'U1L_AI0039.PV', 'U1L_AI0040.PV', 'U1L_AI0041.PV', 'U1L_AI0042.PV',
                'U1L_AI0043.PV', 'U1L_AI0044.PV', 'U1L_AI0045.PV', 'U1L_AI0046.PV','U1L_AI0047.PV', 'U1L_AI0034.PV', 'U1L_RTD0017.PV'))
                    OR (p.sTagName IN ('U1L_RTD0023.PV', 'U1L_RTD0015.PV'))
                    OR (p.sTagName IN ('U1L_AI0016.PV', 'U1L_AI0023.PV', 'U1L_AI0024.PV', 'U1L_AI0030.PV', 'U1L_AI0032.PV','U1L_AI0033.PV', 'U1L_AI0048.PV', 'UL_AI0031.PV', 
                    'U1L_AI0021.PV', 'U1L_AI0022.PV','U1L_RTD0013.PV'))
                    OR (p.sTagName IN ('U1C_DI0145', 'U1C_DI0146'))
                    OR (p.sTagName IN ('1_T1_oil_phaA_out', '1_T1_oil_phaA_out','1_T1_oil_phaC_out')))
                GROUP BY
                CASE WHEN p.sTagName IN ('U1L_AI0004.PV', 'U1L_AI0005.PV','U1L_AI0006.PV') THEN 'EXTRACT_01'
                        WHEN p.sTagName IN ('U1L_AI0001.PV', 'U1L_AI0002.PV','U1L_AI0003.PV') THEN 'EXTRACT_02'
                        WHEN p.sTagName IN ('U1L_AI0035.PV', 'U1L_AI0036.PV', 'U1L_AI0037.PV', 'U1L_AI0038.PV', 'U1L_AI0039.PV', 'U1L_AI0040.PV', 'U1L_AI0041.PV', 'U1L_AI0042.PV',
                        'U1L_AI0043.PV', 'U1L_AI0044.PV', 'U1L_AI0045.PV', 'U1L_AI0046.PV','U1L_AI0047.PV', 'U1L_AI0034.PV', 'U1L_RTD0017.PV') THEN 'EXTRACT_03'
                        WHEN p.sTagName IN ('U1L_RTD0023.PV', 'U1L_RTD0015.PV') THEN 'EXTRACT_04'
                        WHEN p.sTagName IN ('U1L_AI0016.PV', 'U1L_AI0023.PV', 'U1L_AI0024.PV', 'U1L_AI0030.PV', 'U1L_AI0032.PV','U1L_AI0033.PV', 'U1L_AI0048.PV', 'UL_AI0031.PV', 
                        'U1L_AI0021.PV', 'U1L_AI0022.PV','U1L_RTD0013.PV') THEN 'EXTRACT_05'
                        WHEN p.sTagName IN ('U1C_DI0145', 'U1C_DI0146') THEN 'EXTRACT_06'
                        WHEN p.sTagName IN ('1_T1_oil_phaA_out', '1_T1_oil_phaA_out','1_T1_oil_phaC_out') THEN 'EXTRACT_07'
                        ELSE p.sTagName
                    END,
                    p.iDate,
                    p.iTime,
                    e.EditedValue,
                    e.state`,
        TSVHD_H2:`SELECT 
                    CASE WHEN p.sTagName IN ('U2L_AI0004.PV', 'U2L_AI0005.PV','U2L_AI0006.PV') THEN 'EXTRACT_01'
                        WHEN p.sTagName IN ('U2L_AI0001.PV', 'U2L_AI0002.PV','U2L_AI0003.PV') THEN 'EXTRACT_02'
                        WHEN p.sTagName IN ('U2L_AI0035.PV', 'U2L_AI0036.PV', 'U2L_AI0037.PV', 'U2L_AI0038.PV', 'U2L_AI0039.PV', 'U2L_AI0040.PV', 'U2L_AI0041.PV', 'U2L_AI0042.PV',
                        'U2L_AI0043.PV', 'U2L_AI0044.PV', 'U2L_AI0045.PV', 'U2L_AI0046.PV','U2L_AI0047.PV', 'U2L_AI0034.PV', 'U2L_RTD0017.PV') THEN 'EXTRACT_03'
                        WHEN p.sTagName IN ('U2L_RTD0023.PV', 'U2L_RTD0015.PV') THEN 'EXTRACT_04'
                        WHEN p.sTagName IN ('U2L_AI0016.PV', 'U2L_AI0023.PV', 'U2L_AI0024.PV', 'U2L_AI0030.PV', 'U2L_AI0032.PV','U2L_AI0033.PV', 'U2L_AI0048.PV', 'UL_AI0031.PV', 
                        'U2L_AI0021.PV', 'U2L_AI0022.PV','U2L_RTD0013.PV') THEN 'EXTRACT_05'
                        WHEN p.sTagName IN ('U1C_DI0145', 'U1C_DI0146') THEN 'EXTRACT_06'
                        WHEN p.sTagName IN ('1_T1_oil_phaA_out', '1_T1_oil_phaA_out','1_T1_oil_phaC_out') THEN 'EXTRACT_07'
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
                    CAST(DATEADD(hour, -1, p.dtDate) AS date) = '2024-01-08' AND (
                    (p.sTagName IN ('U2L_RTD0007.PV', 'U2L_RTD0008.PV', 'U2L_RTD0009.PV', 'U2L_RTD0010.PV', 'U2L_RTD0011.PV', 'U2L_RTD0012.PV', 
                    'U2L_AI0007.PV', 'U2L_AI0008.PV', 'U1C_PAI0003', 'U2L_AI0013.PV', 'U2L_AI0014.PV','SYL_AI0025.PV','U2L_AI0010.PV','U2L_AI0026.PV','U2L_AI0025.PV',
                    'U2L_AI0027.PV','U2L_RTD0001.PV','U2L_RTD0002.PV','U2L_RTD0003.PV','U2L_RTD0005.PV','U2L_RTD0006.PV','U2L_RTD0007.PV','U2L_RTD0008.PV','U2L_RTD0009.PV',
                    'U2L_RTD0010.PV','U2L_RTD0011.PV','U2L_RTD0012.PV','U2L_RTD0014.PV','U2L_RTD0018.PV','U2L_RTD0019.PV','U1C_DI0273','U1C_DI0274','U1C_DI0142'))
                    OR (p.sTagName IN ('U2L_AI0004.PV', 'U2L_AI0005.PV','U2L_AI0006.PV'))
                    OR (p.sTagName IN ('U2L_AI0001.PV', 'U2L_AI0002.PV','U2L_AI0003.PV'))
                    OR (p.sTagName IN ('U2L_AI0035.PV', 'U2L_AI0036.PV', 'U2L_AI0037.PV', 'U2L_AI0038.PV', 'U2L_AI0039.PV', 'U2L_AI0040.PV', 'U2L_AI0041.PV', 'U2L_AI0042.PV',
                'U2L_AI0043.PV', 'U2L_AI0044.PV', 'U2L_AI0045.PV', 'U2L_AI0046.PV','U2L_AI0047.PV', 'U2L_AI0034.PV', 'U2L_RTD0017.PV'))
                    OR (p.sTagName IN ('U2L_RTD0023.PV', 'U2L_RTD0015.PV'))
                    OR (p.sTagName IN ('U2L_AI0016.PV', 'U2L_AI0023.PV', 'U2L_AI0024.PV', 'U2L_AI0030.PV', 'U2L_AI0032.PV','U2L_AI0033.PV', 'U2L_AI0048.PV', 'UL_AI0031.PV', 
                    'U2L_AI0021.PV', 'U2L_AI0022.PV','U2L_RTD0013.PV'))
                    OR (p.sTagName IN ('U1C_DI0145', 'U1C_DI0146'))
                    OR (p.sTagName IN ('1_T1_oil_phaA_out', '1_T1_oil_phaA_out','1_T1_oil_phaC_out')))
                GROUP BY
                CASE WHEN p.sTagName IN ('U2L_AI0004.PV', 'U2L_AI0005.PV','U2L_AI0006.PV') THEN 'EXTRACT_01'
                        WHEN p.sTagName IN ('U2L_AI0001.PV', 'U2L_AI0002.PV','U2L_AI0003.PV') THEN 'EXTRACT_02'
                        WHEN p.sTagName IN ('U2L_AI0035.PV', 'U2L_AI0036.PV', 'U2L_AI0037.PV', 'U2L_AI0038.PV', 'U2L_AI0039.PV', 'U2L_AI0040.PV', 'U2L_AI0041.PV', 'U2L_AI0042.PV',
                        'U2L_AI0043.PV', 'U2L_AI0044.PV', 'U2L_AI0045.PV', 'U2L_AI0046.PV','U2L_AI0047.PV', 'U2L_AI0034.PV', 'U2L_RTD0017.PV') THEN 'EXTRACT_03'
                        WHEN p.sTagName IN ('U2L_RTD0023.PV', 'U2L_RTD0015.PV') THEN 'EXTRACT_04'
                        WHEN p.sTagName IN ('U2L_AI0016.PV', 'U2L_AI0023.PV', 'U2L_AI0024.PV', 'U2L_AI0030.PV', 'U2L_AI0032.PV','U2L_AI0033.PV', 'U2L_AI0048.PV', 'UL_AI0031.PV', 
                        'U2L_AI0021.PV', 'U2L_AI0022.PV','U2L_RTD0013.PV') THEN 'EXTRACT_05'
                        WHEN p.sTagName IN ('U1C_DI0145', 'U1C_DI0146') THEN 'EXTRACT_06'
                        WHEN p.sTagName IN ('1_T1_oil_phaA_out', '1_T1_oil_phaA_out','1_T1_oil_phaC_out') THEN 'EXTRACT_07'
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