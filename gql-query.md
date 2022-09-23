# Graphql Queries

## Get Character Data

```graphql
{
    rateLimitData {
        limitPerHour
        pointsSpentThisHour
        pointsResetIn
    }
    characterData {
        character(name: "Cater Fish", serverSlug: "zalera", serverRegion: "na") {
            zoneRankings(zoneID: 49, timeframe: Today, metric: rdps, difficulty: 101, includePrivateLogs: true)
        }
    }
}
```

### Response

```json
{
    "data": {
        "rateLimitData": {
            "limitPerHour": 48000,
            "pointsSpentThisHour": 26.62,
            "pointsResetIn": 2118
        },
        "characterData": {
            "character": {
                "zoneRankings": {
                    "bestPerformanceAverage": null,
                    "medianPerformanceAverage": null,
                    "difficulty": 101,
                    "metric": "rdps",
                    "partition": 1,
                    "zone": 49,
                    "allStars": [],
                    "rankings": [
                        {
                            "encounter": {
                                "id": 83,
                                "name": "Proto-Carbuncle"
                            },
                            "rankPercent": null,
                            "medianPercent": null,
                            "allStars": null,
                            "lockedIn": true,
                            "totalKills": 0,
                            "fastestKill": 0,
                            "bestAmount": 0,
                            "spec": null
                        },
                        {
                            "encounter": {
                                "id": 84,
                                "name": "Hegemone"
                            },
                            "rankPercent": null,
                            "medianPercent": null,
                            "allStars": null,
                            "lockedIn": true,
                            "totalKills": 0,
                            "fastestKill": 0,
                            "bestAmount": 0,
                            "spec": null
                        },
                        {
                            "encounter": {
                                "id": 85,
                                "name": "Agdistis"
                            },
                            "rankPercent": null,
                            "medianPercent": null,
                            "allStars": null,
                            "lockedIn": true,
                            "totalKills": 0,
                            "fastestKill": 0,
                            "bestAmount": 0,
                            "spec": null
                        },
                        {
                            "encounter": {
                                "id": 86,
                                "name": "Hephaistos"
                            },
                            "rankPercent": null,
                            "medianPercent": null,
                            "allStars": null,
                            "lockedIn": true,
                            "totalKills": 0,
                            "fastestKill": 0,
                            "bestAmount": 0,
                            "spec": null
                        },
                        {
                            "encounter": {
                                "id": 87,
                                "name": "Hephaistos II"
                            },
                            "rankPercent": null,
                            "medianPercent": null,
                            "allStars": null,
                            "lockedIn": true,
                            "totalKills": 0,
                            "fastestKill": 0,
                            "bestAmount": 0,
                            "spec": null
                        }
                    ]
                }
            }
        }
    }
}
```

## Zone List query from fflogs api

```graphql
{
    rateLimitData {
        limitPerHour
        pointsSpentThisHour
        pointsResetIn
    }
    worldData {
        expansions {
            id
            name
            zones {
                id
                name
                brackets {
                    min
                    max
                    type
                    bucket
                }
                difficulties {
                    id
                    name
                    sizes
                }
                encounters {
                    id
                    name
                }
                frozen
                partitions {
                    id
                    name
                    default
                }
            }
        }
    }
}
```

### Response

```json
{
    "data": {
        "rateLimitData": {
            "limitPerHour": 48000,
            "pointsSpentThisHour": 9,
            "pointsResetIn": 3228
        },
        "worldData": {
            "expansions": [
                {
                    "id": 4,
                    "name": "Endwalker",
                    "zones": [
                        {
                            "id": 49,
                            "name": "Abyssos",
                            "brackets": {
                                "min": 6,
                                "max": 6.2,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 101,
                                    "name": "Savage",
                                    "sizes": [8]
                                },
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 83,
                                    "name": "Proto-Carbuncle"
                                },
                                {
                                    "id": 84,
                                    "name": "Hegemone"
                                },
                                {
                                    "id": 85,
                                    "name": "Agdistis"
                                },
                                {
                                    "id": 86,
                                    "name": "Hephaistos"
                                },
                                {
                                    "id": 87,
                                    "name": "Hephaistos II"
                                }
                            ],
                            "frozen": false,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps (6.2)",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps (6.2)",
                                    "default": false
                                },
                                {
                                    "id": 3,
                                    "name": "Standard Comps (6.2)",
                                    "default": true
                                },
                                {
                                    "id": 4,
                                    "name": "Non-Standard Comps (6.2)",
                                    "default": false
                                },
                                {
                                    "id": 5,
                                    "name": "Standard Comps (6.2)",
                                    "default": true
                                },
                                {
                                    "id": 6,
                                    "name": "Non-Standard Comps (6.2)",
                                    "default": false
                                }
                            ]
                        },
                        {
                            "id": 44,
                            "name": "Asphodelos",
                            "brackets": {
                                "min": 6,
                                "max": 6.2,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 101,
                                    "name": "Savage",
                                    "sizes": [8]
                                },
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 78,
                                    "name": "Erichthonios"
                                },
                                {
                                    "id": 79,
                                    "name": "Hippokampos"
                                },
                                {
                                    "id": 80,
                                    "name": "Phoinix"
                                },
                                {
                                    "id": 81,
                                    "name": "Hesperos"
                                },
                                {
                                    "id": 82,
                                    "name": "Hesperos II"
                                }
                            ],
                            "frozen": false,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps (6.0)",
                                    "default": false
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps (6.0)",
                                    "default": false
                                },
                                {
                                    "id": 3,
                                    "name": "Standard Comps (6.0)",
                                    "default": false
                                },
                                {
                                    "id": 4,
                                    "name": "Non-Standard Comps (6.0)",
                                    "default": false
                                },
                                {
                                    "id": 5,
                                    "name": "Standard Comps (6.0)",
                                    "default": true
                                },
                                {
                                    "id": 6,
                                    "name": "Non-Standard Comps (6.0)",
                                    "default": false
                                },
                                {
                                    "id": 7,
                                    "name": "Standard Comps (6.1)",
                                    "default": true
                                },
                                {
                                    "id": 8,
                                    "name": "Non-Standard Comps (6.1)",
                                    "default": false
                                },
                                {
                                    "id": 9,
                                    "name": "Standard Comps (6.1)",
                                    "default": true
                                },
                                {
                                    "id": 10,
                                    "name": "Non-Standard Comps (6.1)",
                                    "default": false
                                },
                                {
                                    "id": 11,
                                    "name": "Standard Comps (6.1)",
                                    "default": false
                                },
                                {
                                    "id": 12,
                                    "name": "Non-Standard Comps (6.1)",
                                    "default": false
                                }
                            ]
                        },
                        {
                            "id": 45,
                            "name": "Dragonsong's Reprise",
                            "brackets": {
                                "min": 6,
                                "max": 6.2,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 1065,
                                    "name": "Dragonsong's Reprise"
                                }
                            ],
                            "frozen": false,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps (6.1)",
                                    "default": false
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps (6.1)",
                                    "default": false
                                },
                                {
                                    "id": 3,
                                    "name": "Standard Comps (6.1)",
                                    "default": true
                                },
                                {
                                    "id": 4,
                                    "name": "Non-Standard Comps (6.1)",
                                    "default": false
                                },
                                {
                                    "id": 5,
                                    "name": "Standard Comps (6.1)",
                                    "default": true
                                },
                                {
                                    "id": 6,
                                    "name": "Non-Standard Comps (6.1)",
                                    "default": false
                                },
                                {
                                    "id": 7,
                                    "name": "Standard Comps (6.2)",
                                    "default": true
                                },
                                {
                                    "id": 8,
                                    "name": "Non-Standard Comps (6.2)",
                                    "default": false
                                },
                                {
                                    "id": 9,
                                    "name": "Standard Comps (6.2)",
                                    "default": false
                                },
                                {
                                    "id": 10,
                                    "name": "Non-Standard Comps (6.2)",
                                    "default": false
                                },
                                {
                                    "id": 11,
                                    "name": "Standard Comps (6.2)",
                                    "default": false
                                },
                                {
                                    "id": 12,
                                    "name": "Non-Standard Comps (6.2)",
                                    "default": false
                                }
                            ]
                        },
                        {
                            "id": 43,
                            "name": "Ultimates (Legacy)",
                            "brackets": {
                                "min": 6,
                                "max": 6.2,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 1060,
                                    "name": "The Unending Coil of Bahamut"
                                },
                                {
                                    "id": 1061,
                                    "name": "The Weapon's Refrain"
                                },
                                {
                                    "id": 1062,
                                    "name": "The Epic of Alexander"
                                }
                            ],
                            "frozen": false,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps (6.0)",
                                    "default": false
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps (6.0)",
                                    "default": false
                                },
                                {
                                    "id": 3,
                                    "name": "Standard Comps (6.0)",
                                    "default": false
                                },
                                {
                                    "id": 4,
                                    "name": "Non-Standard Comps (6.0)",
                                    "default": false
                                },
                                {
                                    "id": 5,
                                    "name": "Standard Comps (6.0)",
                                    "default": true
                                },
                                {
                                    "id": 6,
                                    "name": "Non-Standard Comps (6.0)",
                                    "default": false
                                },
                                {
                                    "id": 7,
                                    "name": "Standard Comps (6.1)",
                                    "default": false
                                },
                                {
                                    "id": 8,
                                    "name": "Non-Standard Comps (6.1)",
                                    "default": false
                                },
                                {
                                    "id": 9,
                                    "name": "Standard Comps (6.1)",
                                    "default": true
                                },
                                {
                                    "id": 10,
                                    "name": "Non-Standard Comps (6.1)",
                                    "default": false
                                },
                                {
                                    "id": 11,
                                    "name": "Standard Comps (6.1)",
                                    "default": false
                                },
                                {
                                    "id": 12,
                                    "name": "Non-Standard Comps (6.1)",
                                    "default": false
                                },
                                {
                                    "id": 13,
                                    "name": "Standard Comps (6.2)",
                                    "default": true
                                },
                                {
                                    "id": 14,
                                    "name": "Non-Standard Comps (6.2)",
                                    "default": false
                                },
                                {
                                    "id": 15,
                                    "name": "Standard Comps (6.2)",
                                    "default": false
                                },
                                {
                                    "id": 16,
                                    "name": "Non-Standard Comps (6.2)",
                                    "default": false
                                },
                                {
                                    "id": 17,
                                    "name": "Standard Comps (6.2)",
                                    "default": false
                                },
                                {
                                    "id": 18,
                                    "name": "Non-Standard Comps (6.2)",
                                    "default": false
                                }
                            ]
                        },
                        {
                            "id": 50,
                            "name": "Trials II (Extreme)",
                            "brackets": {
                                "min": 6,
                                "max": 6.2,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 1066,
                                    "name": "Barbariccia"
                                }
                            ],
                            "frozen": false,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps (6.2)",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps (6.2)",
                                    "default": false
                                },
                                {
                                    "id": 3,
                                    "name": "Standard Comps (6.2)",
                                    "default": true
                                },
                                {
                                    "id": 4,
                                    "name": "Non-Standard Comps (6.2)",
                                    "default": false
                                },
                                {
                                    "id": 5,
                                    "name": "Standard Comps (6.2)",
                                    "default": true
                                },
                                {
                                    "id": 6,
                                    "name": "Non-Standard Comps (6.2)",
                                    "default": false
                                }
                            ]
                        },
                        {
                            "id": 42,
                            "name": "Trials I (Extreme)",
                            "brackets": {
                                "min": 6,
                                "max": 6.2,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 1058,
                                    "name": "Zodiark"
                                },
                                {
                                    "id": 1059,
                                    "name": "Hydaelyn"
                                },
                                {
                                    "id": 1063,
                                    "name": "Endsinger"
                                }
                            ],
                            "frozen": false,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps (6.0)",
                                    "default": false
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps (6.0)",
                                    "default": false
                                },
                                {
                                    "id": 3,
                                    "name": "Standard Comps (6.0)",
                                    "default": false
                                },
                                {
                                    "id": 4,
                                    "name": "Non-Standard Comps (6.0)",
                                    "default": false
                                },
                                {
                                    "id": 5,
                                    "name": "Standard Comps (6.0)",
                                    "default": true
                                },
                                {
                                    "id": 6,
                                    "name": "Non-Standard Comps (6.0)",
                                    "default": false
                                },
                                {
                                    "id": 7,
                                    "name": "Standard Comps (6.1)",
                                    "default": false
                                },
                                {
                                    "id": 8,
                                    "name": "Non-Standard Comps (6.1)",
                                    "default": false
                                },
                                {
                                    "id": 9,
                                    "name": "Standard Comps (6.1)",
                                    "default": true
                                },
                                {
                                    "id": 10,
                                    "name": "Non-Standard Comps (6.1)",
                                    "default": false
                                },
                                {
                                    "id": 11,
                                    "name": "Standard Comps (6.1)",
                                    "default": false
                                },
                                {
                                    "id": 12,
                                    "name": "Non-Standard Comps (6.1)",
                                    "default": false
                                },
                                {
                                    "id": 13,
                                    "name": "Standard Comps (6.2)",
                                    "default": true
                                },
                                {
                                    "id": 14,
                                    "name": "Non-Standard Comps (6.2)",
                                    "default": false
                                },
                                {
                                    "id": 15,
                                    "name": "Standard Comps (6.2)",
                                    "default": false
                                },
                                {
                                    "id": 16,
                                    "name": "Non-Standard Comps (6.2)",
                                    "default": false
                                },
                                {
                                    "id": 17,
                                    "name": "Standard Comps (6.2)",
                                    "default": false
                                },
                                {
                                    "id": 18,
                                    "name": "Non-Standard Comps (6.2)",
                                    "default": false
                                }
                            ]
                        },
                        {
                            "id": 46,
                            "name": "Trials (Unreal)",
                            "brackets": {
                                "min": 6,
                                "max": 6.2,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 3004,
                                    "name": "Ultima's Bane"
                                },
                                {
                                    "id": 3005,
                                    "name": "Sephirot"
                                }
                            ],
                            "frozen": false,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 3,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 4,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 5,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 6,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                }
                            ]
                        },
                        {
                            "id": 41,
                            "name": "Dungeons (Endgame)",
                            "brackets": {
                                "min": 6,
                                "max": 6.2,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 10,
                                    "name": "Dungeon",
                                    "sizes": [4]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 4528,
                                    "name": "The Dead Ends"
                                },
                                {
                                    "id": 4529,
                                    "name": "Smileton"
                                },
                                {
                                    "id": 4530,
                                    "name": "The Stigma Dreamscape"
                                },
                                {
                                    "id": 4531,
                                    "name": "Alzadaal's Legacy"
                                },
                                {
                                    "id": 4532,
                                    "name": "The Fell Court of Troia"
                                }
                            ],
                            "frozen": false,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "default",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "default",
                                    "default": true
                                },
                                {
                                    "id": 3,
                                    "name": "default",
                                    "default": true
                                }
                            ]
                        },
                        {
                            "id": 47,
                            "name": "Aglaia",
                            "brackets": {
                                "min": 6,
                                "max": 6.2,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [24]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 2037,
                                    "name": "Byregot"
                                },
                                {
                                    "id": 2038,
                                    "name": "Rhalgr"
                                },
                                {
                                    "id": 2039,
                                    "name": "Azeyma"
                                },
                                {
                                    "id": 2040,
                                    "name": "Nald'thal"
                                }
                            ],
                            "frozen": false,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "default",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "default",
                                    "default": true
                                },
                                {
                                    "id": 3,
                                    "name": "default",
                                    "default": true
                                }
                            ]
                        },
                        {
                            "id": 48,
                            "name": "Delubrum Reginae",
                            "brackets": {
                                "min": 6,
                                "max": 6.2,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 101,
                                    "name": "Savage",
                                    "sizes": [48]
                                },
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [24]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 2041,
                                    "name": "Trinity Seeker"
                                },
                                {
                                    "id": 2042,
                                    "name": "The Queen's Guard"
                                },
                                {
                                    "id": 2043,
                                    "name": "Trinity Avowed"
                                },
                                {
                                    "id": 2044,
                                    "name": "The Queen"
                                }
                            ],
                            "frozen": false,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "default",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "default",
                                    "default": true
                                },
                                {
                                    "id": 3,
                                    "name": "default",
                                    "default": true
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": 3,
                    "name": "Shadowbringers",
                    "zones": [
                        {
                            "id": 38,
                            "name": "Eden's Promise",
                            "brackets": {
                                "min": 5,
                                "max": 5.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 101,
                                    "name": "Savage",
                                    "sizes": [8]
                                },
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 73,
                                    "name": "Cloud of Darkness"
                                },
                                {
                                    "id": 74,
                                    "name": "Shadowkeeper"
                                },
                                {
                                    "id": 75,
                                    "name": "Fatebreaker"
                                },
                                {
                                    "id": 76,
                                    "name": "Eden's Promise"
                                },
                                {
                                    "id": 77,
                                    "name": "Oracle of Darkness"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 3,
                                    "name": "Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 4,
                                    "name": "Non-Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 5,
                                    "name": "Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 6,
                                    "name": "Non-Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 7,
                                    "name": "Standard Comps (5.5)",
                                    "default": true
                                },
                                {
                                    "id": 8,
                                    "name": "Non-Standard Comps (5.5)",
                                    "default": false
                                },
                                {
                                    "id": 9,
                                    "name": "Standard Comps (5.5)",
                                    "default": true
                                },
                                {
                                    "id": 10,
                                    "name": "Non-Standard Comps (5.5)",
                                    "default": false
                                },
                                {
                                    "id": 11,
                                    "name": "Standard Comps (5.5)",
                                    "default": true
                                },
                                {
                                    "id": 12,
                                    "name": "Non-Standard Comps (5.5)",
                                    "default": false
                                },
                                {
                                    "id": 13,
                                    "name": "Standard Comps (Echo)",
                                    "default": false
                                },
                                {
                                    "id": 14,
                                    "name": "Non-Standard Comps (Echo)",
                                    "default": false
                                },
                                {
                                    "id": 15,
                                    "name": "Standard Comps (Echo)",
                                    "default": false
                                },
                                {
                                    "id": 16,
                                    "name": "Non-Standard Comps (Echo)",
                                    "default": false
                                },
                                {
                                    "id": 17,
                                    "name": "Standard Comps (Echo)",
                                    "default": false
                                },
                                {
                                    "id": 18,
                                    "name": "Non-Standard Comps (Echo)",
                                    "default": false
                                }
                            ]
                        },
                        {
                            "id": 33,
                            "name": "Eden's Verse",
                            "brackets": {
                                "min": 5,
                                "max": 5.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 101,
                                    "name": "Savage",
                                    "sizes": [8]
                                },
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 69,
                                    "name": "Ramuh"
                                },
                                {
                                    "id": 70,
                                    "name": "Ifrit and Garuda"
                                },
                                {
                                    "id": 71,
                                    "name": "The Idol of Darkness"
                                },
                                {
                                    "id": 72,
                                    "name": "Shiva"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 3,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 4,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 5,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 6,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 7,
                                    "name": "Standard Comps (5.3)",
                                    "default": false
                                },
                                {
                                    "id": 8,
                                    "name": "Non-Standard Comps (5.3)",
                                    "default": false
                                },
                                {
                                    "id": 9,
                                    "name": "Standard Comps (5.3)",
                                    "default": false
                                },
                                {
                                    "id": 10,
                                    "name": "Non-Standard Comps (5.3)",
                                    "default": false
                                },
                                {
                                    "id": 11,
                                    "name": "Standard Comps (5.3)",
                                    "default": false
                                },
                                {
                                    "id": 12,
                                    "name": "Non-Standard Comps (5.3)",
                                    "default": false
                                }
                            ]
                        },
                        {
                            "id": 29,
                            "name": "Eden's Gate",
                            "brackets": {
                                "min": 5,
                                "max": 5.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 101,
                                    "name": "Savage",
                                    "sizes": [8]
                                },
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 65,
                                    "name": "Eden Prime"
                                },
                                {
                                    "id": 66,
                                    "name": "Voidwalker"
                                },
                                {
                                    "id": 67,
                                    "name": "Leviathan"
                                },
                                {
                                    "id": 68,
                                    "name": "Titan"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps (5.0)",
                                    "default": false
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps (5.0)",
                                    "default": false
                                },
                                {
                                    "id": 3,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 4,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 5,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 6,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 7,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 8,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                }
                            ]
                        },
                        {
                            "id": 32,
                            "name": "Ultimates",
                            "brackets": {
                                "min": 5,
                                "max": 5.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 1050,
                                    "name": "The Epic of Alexander"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 3,
                                    "name": "Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 4,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 5,
                                    "name": "Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 6,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 7,
                                    "name": "Standard Comps (5.3)",
                                    "default": false
                                },
                                {
                                    "id": 8,
                                    "name": "Non-Standard Comps (5.3)",
                                    "default": false
                                },
                                {
                                    "id": 9,
                                    "name": "Standard Comps (5.3)",
                                    "default": false
                                },
                                {
                                    "id": 10,
                                    "name": "Non-Standard Comps (5.3)",
                                    "default": false
                                },
                                {
                                    "id": 11,
                                    "name": "Standard Comps (5.3)",
                                    "default": false
                                },
                                {
                                    "id": 12,
                                    "name": "Non-Standard Comps (5.3)",
                                    "default": false
                                },
                                {
                                    "id": 13,
                                    "name": "Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 14,
                                    "name": "Non-Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 15,
                                    "name": "Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 16,
                                    "name": "Non-Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 17,
                                    "name": "Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 18,
                                    "name": "Non-Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 19,
                                    "name": "Standard Comps (5.5)",
                                    "default": true
                                },
                                {
                                    "id": 20,
                                    "name": "Non-Standard Comps (5.5)",
                                    "default": false
                                },
                                {
                                    "id": 21,
                                    "name": "Standard Comps (5.5)",
                                    "default": true
                                },
                                {
                                    "id": 22,
                                    "name": "Non-Standard Comps (5.5)",
                                    "default": false
                                },
                                {
                                    "id": 23,
                                    "name": "Standard Comps (5.5)",
                                    "default": true
                                },
                                {
                                    "id": 24,
                                    "name": "Non-Standard Comps (5.5)",
                                    "default": false
                                }
                            ]
                        },
                        {
                            "id": 30,
                            "name": "Ultimates (Stormblood)",
                            "brackets": {
                                "min": 5,
                                "max": 5.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 1047,
                                    "name": "The Unending Coil of Bahamut"
                                },
                                {
                                    "id": 1048,
                                    "name": "The Weapon's Refrain"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 3,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 4,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 5,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 6,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                }
                            ]
                        },
                        {
                            "id": 37,
                            "name": "Trials III (Extreme)",
                            "brackets": {
                                "min": 5,
                                "max": 5.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 1055,
                                    "name": "The Emerald Weapon II"
                                },
                                {
                                    "id": 1056,
                                    "name": "The Emerald Weapon I"
                                },
                                {
                                    "id": 1057,
                                    "name": "The Diamond Weapon"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 3,
                                    "name": "Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 4,
                                    "name": "Non-Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 5,
                                    "name": "Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 6,
                                    "name": "Non-Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 7,
                                    "name": "Standard Comps (5.5)",
                                    "default": true
                                },
                                {
                                    "id": 8,
                                    "name": "Non-Standard Comps (5.5)",
                                    "default": false
                                },
                                {
                                    "id": 9,
                                    "name": "Standard Comps (5.5)",
                                    "default": true
                                },
                                {
                                    "id": 10,
                                    "name": "Non-Standard Comps (5.5)",
                                    "default": false
                                },
                                {
                                    "id": 11,
                                    "name": "Standard Comps (5.5)",
                                    "default": true
                                },
                                {
                                    "id": 12,
                                    "name": "Non-Standard Comps (5.5)",
                                    "default": false
                                }
                            ]
                        },
                        {
                            "id": 34,
                            "name": "Trials II (Extreme)",
                            "brackets": {
                                "min": 5,
                                "max": 5.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 1051,
                                    "name": "The Ruby Weapon I"
                                },
                                {
                                    "id": 1052,
                                    "name": "The Ruby Weapon II"
                                },
                                {
                                    "id": 1053,
                                    "name": "Varis Yae Galvus"
                                },
                                {
                                    "id": 1054,
                                    "name": "Warrior of Light"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps (5.0)",
                                    "default": false
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps (5.0)",
                                    "default": false
                                },
                                {
                                    "id": 3,
                                    "name": "Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 4,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 5,
                                    "name": "Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 6,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 7,
                                    "name": "Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 8,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 9,
                                    "name": "Standard Comps (5.3)",
                                    "default": false
                                },
                                {
                                    "id": 10,
                                    "name": "Non-Standard Comps (5.3)",
                                    "default": false
                                },
                                {
                                    "id": 11,
                                    "name": "Standard Comps (5.3)",
                                    "default": false
                                },
                                {
                                    "id": 12,
                                    "name": "Non-Standard Comps (5.3)",
                                    "default": false
                                },
                                {
                                    "id": 13,
                                    "name": "Standard Comps (5.3)",
                                    "default": false
                                },
                                {
                                    "id": 14,
                                    "name": "Non-Standard Comps (5.3)",
                                    "default": false
                                },
                                {
                                    "id": 15,
                                    "name": "Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 16,
                                    "name": "Non-Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 17,
                                    "name": "Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 18,
                                    "name": "Non-Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 19,
                                    "name": "Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 20,
                                    "name": "Non-Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 21,
                                    "name": "Standard Comps (5.5)",
                                    "default": true
                                },
                                {
                                    "id": 22,
                                    "name": "Non-Standard Comps (5.5)",
                                    "default": false
                                },
                                {
                                    "id": 23,
                                    "name": "Standard Comps (5.5)",
                                    "default": true
                                },
                                {
                                    "id": 24,
                                    "name": "Non-Standard Comps (5.5)",
                                    "default": false
                                },
                                {
                                    "id": 25,
                                    "name": "Standard Comps (5.5)",
                                    "default": true
                                },
                                {
                                    "id": 26,
                                    "name": "Non-Standard Comps (5.5)",
                                    "default": false
                                }
                            ]
                        },
                        {
                            "id": 28,
                            "name": "Trials I (Extreme)",
                            "brackets": {
                                "min": 5,
                                "max": 5.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 1045,
                                    "name": "Titania"
                                },
                                {
                                    "id": 1046,
                                    "name": "Innocence"
                                },
                                {
                                    "id": 1049,
                                    "name": "Hades"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps (5.0)",
                                    "default": false
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps (5.0)",
                                    "default": false
                                },
                                {
                                    "id": 3,
                                    "name": "Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 4,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 5,
                                    "name": "Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 6,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 7,
                                    "name": "Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 8,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 9,
                                    "name": "Standard Comps (5.3)",
                                    "default": false
                                },
                                {
                                    "id": 10,
                                    "name": "Non-Standard Comps (5.3)",
                                    "default": false
                                },
                                {
                                    "id": 11,
                                    "name": "Standard Comps (5.3)",
                                    "default": false
                                },
                                {
                                    "id": 12,
                                    "name": "Non-Standard Comps (5.3)",
                                    "default": false
                                },
                                {
                                    "id": 13,
                                    "name": "Standard Comps (5.3)",
                                    "default": false
                                },
                                {
                                    "id": 14,
                                    "name": "Non-Standard Comps (5.3)",
                                    "default": false
                                },
                                {
                                    "id": 15,
                                    "name": "Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 16,
                                    "name": "Non-Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 17,
                                    "name": "Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 18,
                                    "name": "Non-Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 19,
                                    "name": "Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 20,
                                    "name": "Non-Standard Comps (5.4)",
                                    "default": false
                                },
                                {
                                    "id": 21,
                                    "name": "Standard Comps (5.5)",
                                    "default": true
                                },
                                {
                                    "id": 22,
                                    "name": "Non-Standard Comps (5.5)",
                                    "default": false
                                },
                                {
                                    "id": 23,
                                    "name": "Standard Comps (5.5)",
                                    "default": true
                                },
                                {
                                    "id": 24,
                                    "name": "Non-Standard Comps (5.5)",
                                    "default": false
                                },
                                {
                                    "id": 25,
                                    "name": "Standard Comps (5.5)",
                                    "default": true
                                },
                                {
                                    "id": 26,
                                    "name": "Non-Standard Comps (5.5)",
                                    "default": false
                                }
                            ]
                        },
                        {
                            "id": 36,
                            "name": "Trials (Unreal)",
                            "brackets": {
                                "min": 5,
                                "max": 5.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 3001,
                                    "name": "Shiva"
                                },
                                {
                                    "id": 3002,
                                    "name": "Titan"
                                },
                                {
                                    "id": 3003,
                                    "name": "Leviathan"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 3,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 4,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 5,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 6,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                }
                            ]
                        },
                        {
                            "id": 27,
                            "name": "Dungeons (Endgame)",
                            "brackets": {
                                "min": 5,
                                "max": 5.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 10,
                                    "name": "Dungeon",
                                    "sizes": [4]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 4520,
                                    "name": "Amaurot"
                                },
                                {
                                    "id": 4521,
                                    "name": "The Twinning"
                                },
                                {
                                    "id": 4522,
                                    "name": "Akadaemia Anyder"
                                },
                                {
                                    "id": 4523,
                                    "name": "The Grand Cosmos"
                                },
                                {
                                    "id": 4524,
                                    "name": "Anamnesis Anyder"
                                },
                                {
                                    "id": 4525,
                                    "name": "The Heroes' Gauntlet"
                                },
                                {
                                    "id": 4526,
                                    "name": "Matoya's Relict"
                                },
                                {
                                    "id": 4527,
                                    "name": "Paglth'an"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "default",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "default",
                                    "default": true
                                },
                                {
                                    "id": 3,
                                    "name": "default",
                                    "default": true
                                }
                            ]
                        },
                        {
                            "id": 40,
                            "name": "The Tower at Paradigm's Breach",
                            "brackets": {
                                "min": 5,
                                "max": 5.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [24]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 2032,
                                    "name": "Knave of Hearts"
                                },
                                {
                                    "id": 2033,
                                    "name": "Hansel and Gretel"
                                },
                                {
                                    "id": 2034,
                                    "name": "Red Girl"
                                },
                                {
                                    "id": 2035,
                                    "name": "False Idol"
                                },
                                {
                                    "id": 2036,
                                    "name": "Her Inflorescence"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "default",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "default",
                                    "default": true
                                },
                                {
                                    "id": 3,
                                    "name": "default",
                                    "default": true
                                }
                            ]
                        },
                        {
                            "id": 35,
                            "name": "The Puppets' Bunker",
                            "brackets": {
                                "min": 5,
                                "max": 5.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [24]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 2024,
                                    "name": "813P-Operated Aegis Unit"
                                },
                                {
                                    "id": 2025,
                                    "name": "Superior Flight Units"
                                },
                                {
                                    "id": 2026,
                                    "name": "905P-Operated Heavy Artillery Unit"
                                },
                                {
                                    "id": 2027,
                                    "name": "Compound 2P"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "default",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "default",
                                    "default": true
                                },
                                {
                                    "id": 3,
                                    "name": "default",
                                    "default": true
                                }
                            ]
                        },
                        {
                            "id": 31,
                            "name": "The Copied Factory",
                            "brackets": {
                                "min": 5,
                                "max": 5.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [24]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 2020,
                                    "name": "Serial-Jointed Command Model"
                                },
                                {
                                    "id": 2021,
                                    "name": "Hobbes"
                                },
                                {
                                    "id": 2022,
                                    "name": "Engels"
                                },
                                {
                                    "id": 2023,
                                    "name": "9S-Operated Walking Fortress"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "default",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "default",
                                    "default": true
                                },
                                {
                                    "id": 3,
                                    "name": "default",
                                    "default": true
                                }
                            ]
                        },
                        {
                            "id": 39,
                            "name": "Delubrum Reginae",
                            "brackets": {
                                "min": 5,
                                "max": 5.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 101,
                                    "name": "Savage",
                                    "sizes": [48]
                                },
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [24]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 2028,
                                    "name": "Trinity Seeker"
                                },
                                {
                                    "id": 2029,
                                    "name": "The Queen's Guard"
                                },
                                {
                                    "id": 2030,
                                    "name": "Trinity Avowed"
                                },
                                {
                                    "id": 2031,
                                    "name": "The Queen"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "default",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "default",
                                    "default": true
                                },
                                {
                                    "id": 3,
                                    "name": "default",
                                    "default": true
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": 2,
                    "name": "Stormblood",
                    "zones": [
                        {
                            "id": 23,
                            "name": "The Weapon's Refrain",
                            "brackets": {
                                "min": 4,
                                "max": 4.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 1042,
                                    "name": "The Ultima Weapon"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 3,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 4,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 5,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 6,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                }
                            ]
                        },
                        {
                            "id": 19,
                            "name": "The Unending Coil of Bahamut",
                            "brackets": {
                                "min": 4,
                                "max": 4.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 1039,
                                    "name": "Bahamut Prime"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 3,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 4,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 5,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 6,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                }
                            ]
                        },
                        {
                            "id": 14,
                            "name": "Dungeons (Endgame)",
                            "brackets": {
                                "min": 4,
                                "max": 4.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 10,
                                    "name": "Dungeon",
                                    "sizes": [4]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 4510,
                                    "name": "Ala Mhigo"
                                },
                                {
                                    "id": 4511,
                                    "name": "Kugane Castle"
                                },
                                {
                                    "id": 4512,
                                    "name": "The Temple of the Fist"
                                },
                                {
                                    "id": 4513,
                                    "name": "The Drowned City of Skalla"
                                },
                                {
                                    "id": 4514,
                                    "name": "Hells' Lid"
                                },
                                {
                                    "id": 4515,
                                    "name": "The Fractal Continuum (Hard)"
                                },
                                {
                                    "id": 4516,
                                    "name": "The Swallow's Compass"
                                },
                                {
                                    "id": 4517,
                                    "name": "The Burn"
                                },
                                {
                                    "id": 4518,
                                    "name": "Saint Mocianne's Arboretum (Hard)"
                                },
                                {
                                    "id": 4519,
                                    "name": "The Ghimlyt Dark"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "default",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "default",
                                    "default": true
                                },
                                {
                                    "id": 3,
                                    "name": "default",
                                    "default": true
                                }
                            ]
                        },
                        {
                            "id": 15,
                            "name": "Trials (Extreme)",
                            "brackets": {
                                "min": 4,
                                "max": 4.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 1036,
                                    "name": "Susano"
                                },
                                {
                                    "id": 1037,
                                    "name": "Lakshmi"
                                },
                                {
                                    "id": 1038,
                                    "name": "Shinryu"
                                },
                                {
                                    "id": 1040,
                                    "name": "Byakko"
                                },
                                {
                                    "id": 1041,
                                    "name": "Tsukuyomi"
                                },
                                {
                                    "id": 1043,
                                    "name": "Suzaku"
                                },
                                {
                                    "id": 1044,
                                    "name": "Seiryu"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 3,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 4,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 5,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 6,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                }
                            ]
                        },
                        {
                            "id": 25,
                            "name": "Omega: Alphascape (Savage)",
                            "brackets": {
                                "min": 4,
                                "max": 4.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 60,
                                    "name": "Chaos"
                                },
                                {
                                    "id": 61,
                                    "name": "Midgardsormr"
                                },
                                {
                                    "id": 62,
                                    "name": "Omega"
                                },
                                {
                                    "id": 63,
                                    "name": "Omega-M and Omega-F"
                                },
                                {
                                    "id": 64,
                                    "name": "The Final Omega"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 3,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 4,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 5,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 6,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 7,
                                    "name": "Standard Comps (Echo)",
                                    "default": false
                                },
                                {
                                    "id": 8,
                                    "name": "Non-Standard Comps (Echo)",
                                    "default": false
                                },
                                {
                                    "id": 9,
                                    "name": "Standard Comps (Echo)",
                                    "default": false
                                },
                                {
                                    "id": 10,
                                    "name": "Non-Standard Comps (Echo)",
                                    "default": false
                                },
                                {
                                    "id": 11,
                                    "name": "Standard Comps (Echo)",
                                    "default": false
                                },
                                {
                                    "id": 12,
                                    "name": "Non-Standard Comps (Echo)",
                                    "default": false
                                }
                            ]
                        },
                        {
                            "id": 21,
                            "name": "Omega: Sigmascape (Savage)",
                            "brackets": {
                                "min": 4,
                                "max": 4.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 51,
                                    "name": "Phantom Train"
                                },
                                {
                                    "id": 52,
                                    "name": "Demon Chadarnook"
                                },
                                {
                                    "id": 53,
                                    "name": "Guardian"
                                },
                                {
                                    "id": 54,
                                    "name": "Kefka"
                                },
                                {
                                    "id": 55,
                                    "name": "God Kefka"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                }
                            ]
                        },
                        {
                            "id": 17,
                            "name": "Omega: Deltascape (Savage)",
                            "brackets": {
                                "min": 4,
                                "max": 4.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 42,
                                    "name": "Alte Roite"
                                },
                                {
                                    "id": 43,
                                    "name": "Catastrophe"
                                },
                                {
                                    "id": 44,
                                    "name": "Halicarnassus"
                                },
                                {
                                    "id": 45,
                                    "name": "Exdeath"
                                },
                                {
                                    "id": 46,
                                    "name": "Neo Exdeath"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                }
                            ]
                        },
                        {
                            "id": 26,
                            "name": "The Orbonne Monastery",
                            "brackets": {
                                "min": 4,
                                "max": 4.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [24]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 2016,
                                    "name": "Mustadio"
                                },
                                {
                                    "id": 2017,
                                    "name": "Agrias"
                                },
                                {
                                    "id": 2018,
                                    "name": "The Thunder God"
                                },
                                {
                                    "id": 2019,
                                    "name": "Ultima, The High Seraph"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "default",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "default",
                                    "default": true
                                },
                                {
                                    "id": 3,
                                    "name": "default",
                                    "default": true
                                }
                            ]
                        },
                        {
                            "id": 22,
                            "name": "The Ridorana Lighthouse",
                            "brackets": {
                                "min": 4,
                                "max": 4.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [24]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 2012,
                                    "name": "Famfrit, the Darkening Cloud"
                                },
                                {
                                    "id": 2013,
                                    "name": "Belias, the Gigas"
                                },
                                {
                                    "id": 2014,
                                    "name": "Construct 7"
                                },
                                {
                                    "id": 2015,
                                    "name": "Yiazmat"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "default",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "default",
                                    "default": true
                                },
                                {
                                    "id": 3,
                                    "name": "default",
                                    "default": true
                                }
                            ]
                        },
                        {
                            "id": 18,
                            "name": "The Royal City of Rabanastre",
                            "brackets": {
                                "min": 4,
                                "max": 4.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [24]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 2008,
                                    "name": "Mateus, the Corrupt"
                                },
                                {
                                    "id": 2009,
                                    "name": "Hashmal, Bringer of Order"
                                },
                                {
                                    "id": 2010,
                                    "name": "Rofocale"
                                },
                                {
                                    "id": 2011,
                                    "name": "Argath Thadalfus"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "default",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "default",
                                    "default": true
                                },
                                {
                                    "id": 3,
                                    "name": "default",
                                    "default": true
                                }
                            ]
                        },
                        {
                            "id": 24,
                            "name": "Omega: Alphascape (Story)",
                            "brackets": {
                                "min": 4,
                                "max": 4.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 56,
                                    "name": "Chaos"
                                },
                                {
                                    "id": 57,
                                    "name": "Midgardsormr"
                                },
                                {
                                    "id": 58,
                                    "name": "Omega"
                                },
                                {
                                    "id": 59,
                                    "name": "Omega-M and Omega-F"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 3,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 4,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 5,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 6,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                }
                            ]
                        },
                        {
                            "id": 20,
                            "name": "Omega: Sigmascape (Story)",
                            "brackets": {
                                "min": 4,
                                "max": 4.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 47,
                                    "name": "Phantom Train"
                                },
                                {
                                    "id": 48,
                                    "name": "Demon Chadarnook"
                                },
                                {
                                    "id": 49,
                                    "name": "Guardian"
                                },
                                {
                                    "id": 50,
                                    "name": "Kefka"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                }
                            ]
                        },
                        {
                            "id": 16,
                            "name": "Omega: Deltascape (Story)",
                            "brackets": {
                                "min": 4,
                                "max": 4.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 38,
                                    "name": "Alte Roite"
                                },
                                {
                                    "id": 39,
                                    "name": "Catastrophe"
                                },
                                {
                                    "id": 40,
                                    "name": "Halicarnassus"
                                },
                                {
                                    "id": 41,
                                    "name": "Exdeath"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": 1,
                    "name": "Heavensward",
                    "zones": [
                        {
                            "id": 13,
                            "name": "Alexander: The Creator (Savage)",
                            "brackets": {
                                "min": 3,
                                "max": 3.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 34,
                                    "name": "Refurbisher 0"
                                },
                                {
                                    "id": 35,
                                    "name": "Lamebrix Strikebocks"
                                },
                                {
                                    "id": 36,
                                    "name": "Cruise Chaser"
                                },
                                {
                                    "id": 37,
                                    "name": "Alexander Prime"
                                },
                                {
                                    "id": 5008,
                                    "name": "Faust Z"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 3,
                                    "name": "Standard Comps (3.55b+)",
                                    "default": false
                                },
                                {
                                    "id": 4,
                                    "name": "Non-Standard Comps (3.55b+)",
                                    "default": false
                                },
                                {
                                    "id": 5,
                                    "name": "Standard Comps (Echo)",
                                    "default": false
                                },
                                {
                                    "id": 6,
                                    "name": "Non-Standard Comps (Echo)",
                                    "default": false
                                }
                            ]
                        },
                        {
                            "id": 12,
                            "name": "Alexander: The Creator (Story)",
                            "brackets": {
                                "min": 3,
                                "max": 3.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 30,
                                    "name": "Refurbisher 0"
                                },
                                {
                                    "id": 31,
                                    "name": "Lamebrix Strikebocks"
                                },
                                {
                                    "id": 32,
                                    "name": "Cruise Chaser"
                                },
                                {
                                    "id": 33,
                                    "name": "Alexander Prime"
                                },
                                {
                                    "id": 5007,
                                    "name": "Faust Z"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "Standard Comps",
                                    "default": true
                                },
                                {
                                    "id": 2,
                                    "name": "Non-Standard Comps",
                                    "default": false
                                },
                                {
                                    "id": 3,
                                    "name": "Standard Comps (3.55b+)",
                                    "default": false
                                },
                                {
                                    "id": 4,
                                    "name": "Non-Standard Comps (3.55b+)",
                                    "default": false
                                },
                                {
                                    "id": 5,
                                    "name": "Standard Comps (Echo)",
                                    "default": false
                                },
                                {
                                    "id": 6,
                                    "name": "Non-Standard Comps (Echo)",
                                    "default": false
                                }
                            ]
                        },
                        {
                            "id": 10,
                            "name": "Alexander: Midas (Savage)",
                            "brackets": {
                                "min": 3,
                                "max": 3.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 26,
                                    "name": "Ratfinx Twinkledinks"
                                },
                                {
                                    "id": 27,
                                    "name": "The Cuff of the Son"
                                },
                                {
                                    "id": 28,
                                    "name": "Quickthinx Allthoughts"
                                },
                                {
                                    "id": 29,
                                    "name": "Brute Justice"
                                },
                                {
                                    "id": 5006,
                                    "name": "Hummelfaust"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "default",
                                    "default": true
                                }
                            ]
                        },
                        {
                            "id": 9,
                            "name": "Alexander: Midas (Story)",
                            "brackets": {
                                "min": 3,
                                "max": 3.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 22,
                                    "name": "Ratfinx Twinkledinks"
                                },
                                {
                                    "id": 23,
                                    "name": "Vortexer"
                                },
                                {
                                    "id": 24,
                                    "name": "Quickthinx Allthoughts"
                                },
                                {
                                    "id": 25,
                                    "name": "Brute Justice"
                                },
                                {
                                    "id": 5002,
                                    "name": "Hummelfaust"
                                },
                                {
                                    "id": 5003,
                                    "name": "Blaster"
                                },
                                {
                                    "id": 5004,
                                    "name": "Brawler"
                                },
                                {
                                    "id": 5005,
                                    "name": "Swindler"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "default",
                                    "default": true
                                }
                            ]
                        },
                        {
                            "id": 7,
                            "name": "Alexander: Gordias (Savage)",
                            "brackets": {
                                "min": 3,
                                "max": 3.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 18,
                                    "name": "Oppressor"
                                },
                                {
                                    "id": 19,
                                    "name": "The Cuff of the Father"
                                },
                                {
                                    "id": 20,
                                    "name": "Living Liquid"
                                },
                                {
                                    "id": 21,
                                    "name": "The Manipulator"
                                },
                                {
                                    "id": 5001,
                                    "name": "Faust"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "default",
                                    "default": true
                                }
                            ]
                        },
                        {
                            "id": 6,
                            "name": "Alexander: Gordias (Story)",
                            "brackets": {
                                "min": 3,
                                "max": 3.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 14,
                                    "name": "Oppressor"
                                },
                                {
                                    "id": 15,
                                    "name": "The Cuff of the Father"
                                },
                                {
                                    "id": 16,
                                    "name": "Living Liquid"
                                },
                                {
                                    "id": 17,
                                    "name": "The Manipulator"
                                },
                                {
                                    "id": 5000,
                                    "name": "Faust"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "default",
                                    "default": true
                                }
                            ]
                        },
                        {
                            "id": 8,
                            "name": "The Weeping City of Mach",
                            "brackets": {
                                "min": 3,
                                "max": 3.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [24]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 2004,
                                    "name": "Arachne Eve"
                                },
                                {
                                    "id": 2005,
                                    "name": "Forgall"
                                },
                                {
                                    "id": 2006,
                                    "name": "Ozma"
                                },
                                {
                                    "id": 2007,
                                    "name": "Calofisteri"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "default",
                                    "default": true
                                }
                            ]
                        },
                        {
                            "id": 5,
                            "name": "Void Ark",
                            "brackets": {
                                "min": 3,
                                "max": 3.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [24]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 2000,
                                    "name": "Cetus"
                                },
                                {
                                    "id": 2001,
                                    "name": "Irminsul"
                                },
                                {
                                    "id": 2002,
                                    "name": "Cuchulainn"
                                },
                                {
                                    "id": 2003,
                                    "name": "Echidna"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "default",
                                    "default": true
                                }
                            ]
                        },
                        {
                            "id": 4,
                            "name": "Trials (Extreme)",
                            "brackets": {
                                "min": 3,
                                "max": 3.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 100,
                                    "name": "Normal",
                                    "sizes": [8]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 1027,
                                    "name": "Bismarck"
                                },
                                {
                                    "id": 1028,
                                    "name": "Ravana"
                                },
                                {
                                    "id": 1029,
                                    "name": "Thordan"
                                },
                                {
                                    "id": 1031,
                                    "name": "Sephirot"
                                },
                                {
                                    "id": 1033,
                                    "name": "Nidhogg"
                                },
                                {
                                    "id": 1034,
                                    "name": "Sophia"
                                },
                                {
                                    "id": 1035,
                                    "name": "Zurvan"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "default",
                                    "default": true
                                }
                            ]
                        },
                        {
                            "id": 2,
                            "name": "Dungeons (Endgame)",
                            "brackets": {
                                "min": 3,
                                "max": 3.5,
                                "type": "Patch",
                                "bucket": 0.1
                            },
                            "difficulties": [
                                {
                                    "id": 10,
                                    "name": "Dungeon",
                                    "sizes": [4]
                                }
                            ],
                            "encounters": [
                                {
                                    "id": 4500,
                                    "name": "Neverreap"
                                },
                                {
                                    "id": 4501,
                                    "name": "The Fractal Continuum"
                                },
                                {
                                    "id": 4502,
                                    "name": "Saint Mocianne's Arboretum"
                                },
                                {
                                    "id": 4503,
                                    "name": "Pharos Sirius (Hard)"
                                },
                                {
                                    "id": 4504,
                                    "name": "The Antitower"
                                },
                                {
                                    "id": 4505,
                                    "name": "The Lost City of Amdapor (Hard)"
                                },
                                {
                                    "id": 4506,
                                    "name": "Sohr Kai"
                                },
                                {
                                    "id": 4507,
                                    "name": "Hullbreaker Isle (Hard)"
                                },
                                {
                                    "id": 4508,
                                    "name": "Xelphatol"
                                },
                                {
                                    "id": 4509,
                                    "name": "The Great Gubal Library (Hard)"
                                }
                            ],
                            "frozen": true,
                            "partitions": [
                                {
                                    "id": 1,
                                    "name": "default",
                                    "default": true
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
}
```
