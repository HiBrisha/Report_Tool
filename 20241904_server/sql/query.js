const queryCMD=(date,domain,data)=>{
    const queryExcute = {
        ACDC: `WITH AllHours AS (
                    SELECT DISTINCT sTagName, iTime
                    FROM ReportCategories
                    CROSS JOIN (
                        SELECT DISTINCT iTime
                        FROM ProcessLog_Daily 
                        Where iTime < 24
                    ) AS ProcessTimes
                    WHERE report_type='ACDC'
                ),ProcessedData as(
                        SELECT 
                            ah.sTagName,
                            IIF(ah.iTime = 0, 24, ah.iTime) AS iTime,
                            COALESCE(pd.iDate,CONVERT(INT, REPLACE('${date}', '-', ''))) AS iDate,
                            COALESCE(pd.rValue, Null) AS Value
                        FROM 
                            AllHours ah
                        LEFT JOIN 
                            [XHQDB].dbo.[ProcessLog_Daily] pd 
                            ON ah.sTagName = pd.sTagName AND ah.iTime = pd.iTime 
                            AND CAST(DATEADD(hour, -1, dtDate) AS DATE) = '${date}'
                )
                SELECT p.*,
                        COALESCE(e.EditedValue, NULL) AS EditedValue,
                        COALESCE(e.state , 0) AS state 
                FROM ProcessedData p
                LEFT JOIN [XHQDB].dbo.[EditedValue] e 
                        ON p.sTagName = e.sTagName
                        AND p.iDate = e.iDate
                        AND p.iTime = e.iTime
                WHERE p.iTime % 2 = 0`,
        TDD:`WITH AllHours AS (
                SELECT DISTINCT sTagName, iTime
                FROM ReportCategories
                CROSS JOIN (
                    SELECT DISTINCT iTime
                    FROM ProcessLog_Daily 
                    Where iTime < 24
                ) AS ProcessTimes
                WHERE report_type='TDD'
            ),ProcessedData as(
                    SELECT 
                        ah.sTagName,
                        IIF(ah.iTime = 0, 24, ah.iTime) AS iTime,
                        COALESCE(pd.iDate,CONVERT(INT, REPLACE('${date}', '-', ''))) AS iDate,
                        COALESCE(pd.rValue, Null) AS Value
                    FROM 
                        AllHours ah
                    LEFT JOIN 
                        [XHQDB].dbo.[ProcessLog_Daily] pd 
                        ON ah.sTagName = pd.sTagName AND ah.iTime = pd.iTime 
                        AND CAST(DATEADD(hour, -1, dtDate) AS DATE) = '${date}'
            )
            SELECT p.*,
                    COALESCE(e.EditedValue, NULL) AS EditedValue,
                    COALESCE(e.state , 0) AS state 
            FROM ProcessedData p
            LEFT JOIN [XHQDB].dbo.[EditedValue] e 
                    ON p.sTagName = e.sTagName
                    AND p.iDate = e.iDate
                    AND p.iTime = e.iTime
            order by p.sTagName,iTime desc`,
        T220:`WITH AllHours AS (
                 SELECT DISTINCT sTagName, iTime
                 FROM ReportCategories
                 CROSS JOIN (
                     SELECT DISTINCT iTime
                     FROM ProcessLog_Daily 
                     Where iTime < 24
                 ) AS ProcessTimes
                        WHERE report_type='T220'
            ),Cache AS (
                SELECT 
                    CASE 
                        WHEN p.sTagName IN ('SYL_AI0004.PV', 'SYL_AI0004.PV', 'SYL_AI0005.PV') THEN 'T220_01'
                        WHEN p.sTagName IN ('SYL_AI0013.PV', 'SYL_AI0014.PV', 'SYL_AI0015.PV') THEN 'T220_02'
                    ELSE p.sTagName
                        END AS sTagName,
                        CONVERT(int, FORMAT(dtDate, 'yyyyMMdd')) AS iDate,
                    IIF(p.iTime = 0, 24, p.iTime) AS iTime,
                    MAX(p.rValue) AS Value
                FROM [XHQDB].dbo.[ProcessLog_Daily] p
                WHERE 
                    p.sTagName IN ('SYL_AI0004.PV', 'SYL_AI0004.PV', 'SYL_AI0005.PV', 'SYL_AI0013.PV', 'SYL_AI0014.PV', 'SYL_AI0015.PV'
                    ,'SYL_AI0007.PV', 'SYL_AI0008.PV', 'SYL_AI0016.PV', 'SYL_AI0017.PV','SYL_AI0004.PV', 'SYL_AI0004.PV'
                    , 'SYL_AI0005.PV','SYL_AI0013.PV', 'SYL_AI0014.PV', 'SYL_AI0015.PV')
                    AND CAST(DATEADD(hour, -1, dtDate) AS date) = '${date}'
                GROUP BY 
                CASE 
                    WHEN p.sTagName IN ('SYL_AI0004.PV', 'SYL_AI0004.PV', 'SYL_AI0005.PV') THEN 'T220_01'
                    WHEN p.sTagName IN ('SYL_AI0013.PV', 'SYL_AI0014.PV', 'SYL_AI0015.PV') THEN 'T220_02'
                ELSE p.sTagName
                    END,
                    dtDate,
                    IIF(p.iTime = 0, 24, p.iTime)
            ),ProcessData as(
                SELECT  ah.sTagName,
                        COALESCE(c.iDate,CONVERT(INT, REPLACE('${date}', '-', ''))) AS iDate,
                        IIF(ah.iTime = 0, 24, ah.iTime) AS iTime,
                        Value
                FROM AllHours ah
                LEFT JOIN Cache c
                ON ah.sTagName=c.sTagName and ah.iTime = c.iTime)
                SELECT p.sTagName,
                        p.iDate,
                        p.iTime,
                        Value,
                        EditedValue,
                        COALESCE(e.state , 0) AS state 
                FROM ProcessData p
                LEFT JOIN EditedValue e
                ON p.sTagName=e.sTagName and p.iTime = e.iTime and p.iDate=e.iDate;`,
        TSVH_H1:`WITH AllHours AS (
                    SELECT DISTINCT sTagName, iTime
                    FROM ReportCategories
                    CROSS JOIN (
                        SELECT DISTINCT iTime
                        FROM ProcessLog_Daily 
                        Where iTime > 0
                    ) AS ProcessTimes
                    WHERE report_type='TSVH1'
                ),Cache AS (
                    SELECT 
                        CASE --WHEN p.sTagName IN ('U1C_DI0355.PV', 'U1C_DI0356.PV') THEN 'TSVH1_N1'
                            --WHEN p.sTagName IN ('U1C_DI0281.PV', 'U1C_DI0280.PV') THEN 'TSVH1_N2'
                            --WHEN p.sTagName IN ('U1C_DI0279.PV', 'U1C_DI0278.PV') THEN 'TSVH1_N3'
                            --WHEN p.sTagName IN ('U1C_DI0283.PV', 'U1C_DI0282.PV') THEN 'TSVH1_N4'
                            --WHEN p.sTagName IN ('U1C_DI0273.PV', 'U1C_DI0274.PV') THEN 'TSVH1_N5'
                            WHEN p.sTagName IN ('U1L_AI0028.PV', 'U1L_AI0029.PV') THEN 'TSVH1_06'
                            WHEN p.sTagName IN ('U1L_RTD0026.PV', 'U1L_RTD0027.PV') THEN 'TSVH1_07'
                            --WHEN p.sTagName IN ('U1C_DI0357.PV', 'U1C_DI0358.PV') THEN 'TSVH1_N8'
                            ELSE p.sTagName
                        END AS sTagName,
                        p.iDate,
                        IIF(p.iTime = 0, 24, p.iTime) AS iTime,
                        AVG(p.[rValue]) as Value
                    FROM [XHQDB].dbo.[ProcessLog_Daily] p
                    WHERE
                        CAST(DATEADD(hour, -1, p.dtDate) AS date) = '${date}' AND (
                        (p.sTagName IN ('U1L_AI0010.PV', 'U1L_AI0011.PV', 'U1L_AI0012.PV', 'U1L_RTD0025.PV', 
                        'U1L_AI0020.PV', 'U1L_AI0013.PV', 'SYL_AI0025.PV', 'U1L_RTD0021.PV', 'U1C_DI0364.PV'
                        , 'U1C_DI0363.PV', 'U1L_RTD0014.PV'))
                        --OR (p.sTagName IN ('U1C_DI0355.PV', 'U1C_DI0356.PV'))
                        --OR (p.sTagName IN ('U1C_DI0281.PV', 'U1C_DI0280.PV'))
                        --OR (p.sTagName IN ('U1C_DI0279.PV', 'U1C_DI0278.PV'))
                        --OR (p.sTagName IN ('U1C_DI0283.PV', 'U1C_DI0282.PV'))
                        --OR (p.sTagName IN ('U1C_DI0273.PV', 'U1C_DI0274.PV'))
                        OR (p.sTagName IN ('U1L_AI0028.PV', 'U1L_AI0029.PV'))
                        OR (p.sTagName IN ('U1L_RTD0026.PV', 'U1L_RTD0027.PV')))
                        --OR (p.sTagName IN ('U1C_DI0357.PV', 'U1C_DI0358.PV')))
                    GROUP BY
                        CASE-- WHEN p.sTagName IN ('U1C_DI0355.PV', 'U1C_DI0356.PV') THEN 'TSVH1_N1'
                            --WHEN p.sTagName IN ('U1C_DI0281.PV', 'U1C_DI0280.PV') THEN 'TSVH1_N2'
                            --WHEN p.sTagName IN ('U1C_DI0279.PV', 'U1C_DI0278.PV') THEN 'TSVH1_N3'
                            --WHEN p.sTagName IN ('U1C_DI0283.PV', 'U1C_DI0282.PV') THEN 'TSVH1_N4'
                            --WHEN p.sTagName IN ('U1C_DI0273.PV', 'U1C_DI0274.PV') THEN 'TSVH1_N5'
                            WHEN p.sTagName IN ('U1L_AI0028.PV', 'U1L_AI0029.PV') THEN 'TSVH1_06'
                            WHEN p.sTagName IN ('U1L_RTD0026.PV', 'U1L_RTD0027.PV') THEN 'TSVH1_07'
                            --WHEN p.sTagName IN ('U1C_DI0357.PV', 'U1C_DI0358.PV') THEN 'TSVH1_N8'
                            ELSE p.sTagName
                        END,
                        p.iDate,
                        p.iTime
                ),ProcessData as (
                SELECT  ah.sTagName,
                        COALESCE(c.iDate,CONVERT(INT, REPLACE('${date}', '-', ''))) AS iDate,
                        IIF(ah.iTime = 0, 24, ah.iTime) AS iTime,
                        Value
                FROM AllHours ah
                LEFT JOIN Cache c 
                ON ah.sTagName=c.sTagName and ah.iTime = c.iTime )
                SELECT  p.sTagName,
                        p.iDate,
                        p.iTime,
                        p.Value,
                        e.EditedValue,
                        COALESCE(e.state , 0) AS state 
                FROM ProcessData p
                LEFT JOIN EditedValue e
                on p.sTagName=e.sTagName and p.iTime = e.iTime  and p.iDate=e.iDate;`,
        TSVH_H2:`WITH AllHours AS (
                    SELECT DISTINCT sTagName, iTime
                    FROM ReportCategories
                    CROSS JOIN (
                        SELECT DISTINCT iTime
                        FROM ProcessLog_Daily 
                        Where iTime > 0
                    ) AS ProcessTimes
                    WHERE report_type='TSVH2'
                ),Cache AS (
                    SELECT 
                        CASE --WHEN p.sTagName IN ('U2C_DI0355.PV', 'U2C_DI0356.PV') THEN 'TSVH2_N1'
                            --WHEN p.sTagName IN ('U2C_DI0281.PV', 'U2C_DI0280.PV') THEN 'TSVH2_N2'
                            --WHEN p.sTagName IN ('U2C_DI0279.PV', 'U2C_DI0278.PV') THEN 'TSVH2_N3'
                            --WHEN p.sTagName IN ('U2C_DI0283.PV', 'U2C_DI0282.PV') THEN 'TSVH2_N4'
                            --WHEN p.sTagName IN ('U2C_DI0273.PV', 'U2C_DI0274.PV') THEN 'TSVH2_N5'
                            WHEN p.sTagName IN ('U2L_AI0028.PV', 'U2L_AI0029.PV') THEN 'TSVH2_06'
                            WHEN p.sTagName IN ('U2L_RTD0026.PV', 'U2L_RTD0027.PV') THEN 'TSVH2_07'
                            --WHEN p.sTagName IN ('U2C_DI0357.PV', 'U2C_DI0358.PV') THEN 'TSVH2_N8'
                            ELSE p.sTagName
                        END AS sTagName,
                        p.iDate,
                        IIF(p.iTime = 0, 24, p.iTime) AS iTime,
                        AVG(p.[rValue]) as Value
                    FROM [XHQDB].dbo.[ProcessLog_Daily] p
                    WHERE
                        CAST(DATEADD(hour, -1, p.dtDate) AS date) = '${date}' AND (
                        (p.sTagName IN ('U2L_AI0010.PV', 'U2L_AI0011.PV', 'U2L_AI0012.PV', 'U2L_RTD0025.PV', 
                        'U2L_AI0020.PV', 'U2L_AI0013.PV', 'SYL_AI0025.PV', 'U2L_RTD0021.PV', 'U2C_DI0364.PV'
                        , 'U2C_DI0363.PV', 'U2L_RTD0014.PV'))
                        --OR (p.sTagName IN ('U2C_DI0355.PV', 'U2C_DI0356.PV'))
                        --OR (p.sTagName IN ('U2C_DI0281.PV', 'U2C_DI0280.PV'))
                        --OR (p.sTagName IN ('U2C_DI0279.PV', 'U2C_DI0278.PV'))
                        --OR (p.sTagName IN ('U2C_DI0283.PV', 'U2C_DI0282.PV'))
                        --OR (p.sTagName IN ('U2C_DI0273.PV', 'U2C_DI0274.PV'))
                        OR (p.sTagName IN ('U2L_AI0028.PV', 'U2L_AI0029.PV'))
                        OR (p.sTagName IN ('U2L_RTD0026.PV', 'U2L_RTD0027.PV')))
                        --OR (p.sTagName IN ('U2C_DI0357.PV', 'U2C_DI0358.PV')))
                    GROUP BY
                        CASE-- WHEN p.sTagName IN ('U2C_DI0355.PV', 'U2C_DI0356.PV') THEN 'TSVH2_N1'
                            --WHEN p.sTagName IN ('U2C_DI0281.PV', 'U2C_DI0280.PV') THEN 'TSVH2_N2'
                            --WHEN p.sTagName IN ('U2C_DI0279.PV', 'U2C_DI0278.PV') THEN 'TSVH2_N3'
                            --WHEN p.sTagName IN ('U2C_DI0283.PV', 'U2C_DI0282.PV') THEN 'TSVH2_N4'
                            --WHEN p.sTagName IN ('U2C_DI0273.PV', 'U2C_DI0274.PV') THEN 'TSVH2_N5'
                            WHEN p.sTagName IN ('U2L_AI0028.PV', 'U2L_AI0029.PV') THEN 'TSVH2_06'
                            WHEN p.sTagName IN ('U2L_RTD0026.PV', 'U2L_RTD0027.PV') THEN 'TSVH2_07'
                            --WHEN p.sTagName IN ('U2C_DI0357.PV', 'U2C_DI0358.PV') THEN 'TSVH2_N8'
                            ELSE p.sTagName
                        END,
                        p.iDate,
                        p.iTime
                ),ProcessData as (
                SELECT  ah.sTagName,
                        COALESCE(c.iDate,CONVERT(INT, REPLACE('${date}', '-', ''))) AS iDate,
                        IIF(ah.iTime = 0, 24, ah.iTime) AS iTime,
                        Value
                FROM AllHours ah
                LEFT JOIN Cache c 
                ON ah.sTagName=c.sTagName and ah.iTime = c.iTime )
                SELECT  p.sTagName,
                        p.iDate,
                        p.iTime,
                        p.Value,
                        e.EditedValue,
                        COALESCE(e.state , 0) AS state 
                FROM ProcessData p
                LEFT JOIN EditedValue e
                on p.sTagName=e.sTagName and p.iTime = e.iTime  and p.iDate=e.iDate;`,
        TSVHD_H1:`WITH AllHours AS (
                    SELECT DISTINCT sTagName, iTime
                    FROM ReportCategories
                    CROSS JOIN (
                        SELECT DISTINCT iTime
                        FROM ProcessLog_Daily 
                        Where iTime > 0
                    ) AS ProcessTimes
                    WHERE report_type='TSVHD1'
                ),Cache AS (
                    SELECT 
                        CASE WHEN p.sTagName IN ('U1L_AI0004.PV', 'U1L_AI0005.PV','U1L_AI0006.PV') THEN 'TSVHD1_01'
                            WHEN p.sTagName IN ('U1L_AI0001.PV', 'U1L_AI0002.PV','U1L_AI0003.PV') THEN 'TSVHD1_02'
                            WHEN p.sTagName IN ('U1L_AI0035.PV', 'U1L_AI0036.PV', 'U1L_AI0037.PV', 'U1L_AI0038.PV', 'U1L_AI0039.PV', 'U1L_AI0040.PV', 'U1L_AI0041.PV', 'U1L_AI0042.PV',
                            'U1L_AI0043.PV', 'U1L_AI0044.PV', 'U1L_AI0045.PV', 'U1L_AI0046.PV','U1L_AI0047.PV', 'U1L_AI0034.PV', 'U1L_RTD0017.PV') THEN 'TSVHD1_03'
                            WHEN p.sTagName IN ('U1L_RTD0023.PV', 'U1L_RTD0015.PV') THEN 'TSVHD1_04'
                            WHEN p.sTagName IN ('U1L_AI0016.PV', 'U1L_AI0023.PV', 'U1L_AI0024.PV', 'U1L_AI0030.PV', 'U1L_AI0032.PV','U1L_AI0033.PV', 'U1L_AI0048.PV', 'UL_AI0031.PV', 
                            'U1L_AI0021.PV', 'U1L_AI0022.PV','U1L_RTD0013.PV') THEN 'TSVHD1_05'
                            WHEN p.sTagName IN ('U1C_DI0145', 'U1C_DI0146') THEN 'TSVHD1_06'
                            WHEN p.sTagName IN ('1_T1_oil_phaA_out', '1_T1_oil_phaA_out','1_T1_oil_phaC_out') THEN 'TSVHD1_07'
                            ELSE p.sTagName
                        END AS sTagName,
                    p.iDate,
                    IIF(p.iTime = 0, 24, p.iTime) AS iTime,
                    AVG(p.[rValue]) as Value
                FROM [XHQDB].dbo.[ProcessLog_Daily] p
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
                CASE WHEN p.sTagName IN ('U1L_AI0004.PV', 'U1L_AI0005.PV','U1L_AI0006.PV') THEN 'TSVHD1_01'
                        WHEN p.sTagName IN ('U1L_AI0001.PV', 'U1L_AI0002.PV','U1L_AI0003.PV') THEN 'TSVHD1_02'
                        WHEN p.sTagName IN ('U1L_AI0035.PV', 'U1L_AI0036.PV', 'U1L_AI0037.PV', 'U1L_AI0038.PV', 'U1L_AI0039.PV', 'U1L_AI0040.PV', 'U1L_AI0041.PV', 'U1L_AI0042.PV',
                        'U1L_AI0043.PV', 'U1L_AI0044.PV', 'U1L_AI0045.PV', 'U1L_AI0046.PV','U1L_AI0047.PV', 'U1L_AI0034.PV', 'U1L_RTD0017.PV') THEN 'TSVHD1_03'
                        WHEN p.sTagName IN ('U1L_RTD0023.PV', 'U1L_RTD0015.PV') THEN 'TSVHD1_04'
                        WHEN p.sTagName IN ('U1L_AI0016.PV', 'U1L_AI0023.PV', 'U1L_AI0024.PV', 'U1L_AI0030.PV', 'U1L_AI0032.PV','U1L_AI0033.PV', 'U1L_AI0048.PV', 'UL_AI0031.PV', 
                        'U1L_AI0021.PV', 'U1L_AI0022.PV','U1L_RTD0013.PV') THEN 'TSVHD1_05'
                        WHEN p.sTagName IN ('U1C_DI0145', 'U1C_DI0146') THEN 'TSVHD1_06'
                        WHEN p.sTagName IN ('1_T1_oil_phaA_out', '1_T1_oil_phaA_out','1_T1_oil_phaC_out') THEN 'TSVHD1_07'
                        ELSE p.sTagName
                    END,
                    p.iDate,
                    p.iTime
                ),ProcessData as (
                SELECT  ah.sTagName,
                        COALESCE(c.iDate,CONVERT(INT, REPLACE('${date}', '-', ''))) AS iDate,
                        IIF(ah.iTime = 0, 24, ah.iTime) AS iTime,
                        Value
                FROM AllHours ah
                LEFT JOIN Cache c 
                ON ah.sTagName=c.sTagName and ah.iTime = c.iTime )
                SELECT  p.sTagName,
                        p.iDate,
                        p.iTime,
                        p.Value,
                        e.EditedValue,
                        COALESCE(e.state , 0) AS state 
                FROM ProcessData p
                LEFT JOIN EditedValue e
                on p.sTagName=e.sTagName and p.iTime = e.iTime  and p.iDate=e.iDate;`,
        TSVHD_H2:`WITH AllHours AS (
                    SELECT DISTINCT sTagName, iTime
                    FROM ReportCategories
                    CROSS JOIN (
                        SELECT DISTINCT iTime
                        FROM ProcessLog_Daily 
                        Where iTime > 0
                    ) AS ProcessTimes
                    WHERE report_type='TSVHD2'
                ),Cache AS (
                    SELECT 
                        CASE WHEN p.sTagName IN ('U2L_AI0004.PV', 'U2L_AI0005.PV','U2L_AI0006.PV') THEN 'TSVHD2_01'
                            WHEN p.sTagName IN ('U2L_AI0001.PV', 'U2L_AI0002.PV','U2L_AI0003.PV') THEN 'TSVHD2_02'
                            WHEN p.sTagName IN ('U2L_AI0035.PV', 'U2L_AI0036.PV', 'U2L_AI0037.PV', 'U2L_AI0038.PV', 'U2L_AI0039.PV', 'U2L_AI0040.PV', 'U2L_AI0041.PV', 'U2L_AI0042.PV',
                            'U2L_AI0043.PV', 'U2L_AI0044.PV', 'U2L_AI0045.PV', 'U2L_AI0046.PV','U2L_AI0047.PV', 'U2L_AI0034.PV', 'U2L_RTD0017.PV') THEN 'TSVHD2_03'
                            WHEN p.sTagName IN ('U2L_RTD0023.PV', 'U2L_RTD0015.PV') THEN 'TSVHD2_04'
                            WHEN p.sTagName IN ('U2L_AI0016.PV', 'U2L_AI0023.PV', 'U2L_AI0024.PV', 'U2L_AI0030.PV', 'U2L_AI0032.PV','U2L_AI0033.PV', 'U2L_AI0048.PV', 'UL_AI0031.PV', 
                            'U2L_AI0021.PV', 'U2L_AI0022.PV','U2L_RTD0013.PV') THEN 'TSVHD2_05'
                            WHEN p.sTagName IN ('U1C_DI0145', 'U1C_DI0146') THEN 'TSVHD2_06'
                            WHEN p.sTagName IN ('1_T2_oil_phaA_out', '1_T2_oil_phaA_out','1_T2_oil_phaC_out') THEN 'TSVHD2_07'
                            ELSE p.sTagName
                        END AS sTagName,
                    p.iDate,
                    IIF(p.iTime = 0, 24, p.iTime) AS iTime,
                    AVG(p.[rValue]) as Value
                FROM [XHQDB].dbo.[ProcessLog_Daily] p
                WHERE
                    CAST(DATEADD(hour, -1, p.dtDate) AS date) = '${date}' AND (
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
                    OR (p.sTagName IN ('1_T2_oil_phaA_out', '1_T2_oil_phaA_out','1_T2_oil_phaC_out')))
                GROUP BY
                CASE WHEN p.sTagName IN ('U2L_AI0004.PV', 'U2L_AI0005.PV','U2L_AI0006.PV') THEN 'TSVHD2_01'
                        WHEN p.sTagName IN ('U2L_AI0001.PV', 'U2L_AI0002.PV','U2L_AI0003.PV') THEN 'TSVHD2_02'
                        WHEN p.sTagName IN ('U2L_AI0035.PV', 'U2L_AI0036.PV', 'U2L_AI0037.PV', 'U2L_AI0038.PV', 'U2L_AI0039.PV', 'U2L_AI0040.PV', 'U2L_AI0041.PV', 'U2L_AI0042.PV',
                        'U2L_AI0043.PV', 'U2L_AI0044.PV', 'U2L_AI0045.PV', 'U2L_AI0046.PV','U2L_AI0047.PV', 'U2L_AI0034.PV', 'U2L_RTD0017.PV') THEN 'TSVHD2_03'
                        WHEN p.sTagName IN ('U2L_RTD0023.PV', 'U2L_RTD0015.PV') THEN 'TSVHD2_04'
                        WHEN p.sTagName IN ('U2L_AI0016.PV', 'U2L_AI0023.PV', 'U2L_AI0024.PV', 'U2L_AI0030.PV', 'U2L_AI0032.PV','U2L_AI0033.PV', 'U2L_AI0048.PV', 'UL_AI0031.PV', 
                        'U2L_AI0021.PV', 'U2L_AI0022.PV','U2L_RTD0013.PV') THEN 'TSVHD2_05'
                        WHEN p.sTagName IN ('U1C_DI0145', 'U1C_DI0146') THEN 'TSVHD2_06'
                        WHEN p.sTagName IN ('1_T2_oil_phaA_out', '1_T2_oil_phaA_out','1_T2_oil_phaC_out') THEN 'TSVHD2_07'
                        ELSE p.sTagName
                    END,
                    p.iDate,
                    p.iTime
                ),ProcessData as (
                SELECT  ah.sTagName,
                        COALESCE(c.iDate,CONVERT(INT, REPLACE('${date}', '-', ''))) AS iDate,
                        IIF(ah.iTime = 0, 24, ah.iTime) AS iTime,
                        Value
                FROM AllHours ah
                LEFT JOIN Cache c 
                ON ah.sTagName=c.sTagName and ah.iTime = c.iTime )
                SELECT  p.sTagName,
                        p.iDate,
                        p.iTime,
                        p.Value,
                        e.EditedValue,
                        COALESCE(e.state , 0) AS state 
                FROM ProcessData p
                LEFT JOIN EditedValue e
                on p.sTagName=e.sTagName and p.iTime = e.iTime  and p.iDate=e.iDate;`,
        MERGE_DATA:`MERGE INTO [XHQDB].dbo.[EditedValue] AS target
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
                    [XHQDB].[dbo].[Alias_Realtime] a
                INNER JOIN 
                    [DCS_iDB].[dbo].[DCS_Tag_CBM] b ON a.TagName = b.[TAG_DCS]
                WHERE b.[Mã thiết bị] = '`
    }
    
    return queryExcute[domain]
}

module.exports={queryCMD};