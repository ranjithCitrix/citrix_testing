async function syncRates({dataStore, client}) {
    console.log('Rates sync started');
    let response = await client.fetch('/v2/rates')
    console.log(JSON.stringify(response));
    if (response.ok) {
        let rates = await response.json()
        console.log(JSON.stringify(rates.data))
        dataStore.save('rates', rates.data)
    } else {
        throw new Error(`Rates sync failed ${response.status}:${response.statusText}.`)
    }
    console.log('Rates sync finished.')
}

integration.define({
    "synchronizations": [
        {
            "name": "currencies",
            "fullSyncFunction": syncRates
        }
    ],
    "model": {
        "tables": [
            {
                "name": "rates",
                "columns": [
                    {
                        "name": "id",
                        "type": "STRING",
                        "length": 20,
                        "primaryKey": true
                    },
                    {
                        "name": "symbol",
                        "type": "STRING",
                        "length": 3
                    },
                    {
                        "name": "rateUsd",
                        "type": "STRING"
                    }
                ]
            }
        ]
    }
});