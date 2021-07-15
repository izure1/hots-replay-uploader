declare module 'hots-parser' {
  interface ParserProcessReplayOption {
    /**
     * bool, default true. Set to false to skip parsing all taunts, b-step, spray, and dance events. These options use the gamedata archive, which adds significant processing time as the parser loads and inspects all game events.
     */
    getBMData: boolean
    /**
     * bool, default false. Set to true to leave hero names unresolved and use the internal attribute code instead. Hero names are stored in the attr.js file, and will lag behind patches by approximately one day. If you'd like to not worry about new heroes causing problems, you will want to set this to true.
     */
    useAttributeName: boolean
    /**
     * bool, default false. Set to true to override the parser's default verification step. This step aborts parsing if the given replay file is too new (on an unverified build). It is recommended to wait until the parser is updated before running any parsing operations in order to account for unexpected or large changes to the replay file format. This setting bypasses this check, and should be run at your own risk.
     */
    overrideVerifiedBuild: boolean
    /**
     * bool, default false. Prior to version 7, the talents were stored using keys that contained spaces (Tier 1 Choice). The spaces have been removed by default in version 7+ (Tier1Choice). If you are using an application that requires the old keys for legacy compatibility reasons, set this option to true.
     */
    legacyTalentKeys: boolean
  }
  
  export interface ParserProcessReplayReturn {
    /**
     * integer status code indicating success or failure. You want to see a 1 here. See Parser.ReplayStatus for possible values of this field.
     */
    status: ReplayStatus
    match: {
      "version": {
        "m_flags": number
        "m_major": number
        "m_minor": number
        "m_revision": number
        "m_build": number
        "m_baseBuild": number
      }
      "type": number
      "loopLength": number
      "filename": string
      "mode": number
      "map": string
      "date": string
      "rawDate": number
      "playerIDs": string[]
      "heroes": string[]
      "levelTimes": {
        [key: '0'|'1']: {
          [key: string]: {
            "loop": number,
            "level": number,
            "team": string,
            "time": number
          }
        }
      }
      "region": number
      "loopGameStart": number
      "length": number
      "bans": {
        [key: '0'|'1']: {
          "hero": string
          "order": number
          "absolute": number
        }[]
      }
      "picks": {
        "0": string[]
        "1": string[]
        "first": number
      }
      "teams": {
        [key: '0'|'1']: {
          "ids": string[]
          "names": string[]
          "heroes": string[]
          "takedowns": number
          "level": number
          "stats": {
            "mercCaptures": number
            "mercUptime": number
            "mercUptimePercent": number
            "structures": {
              "Keep Tower": {
                "lost": number
                "destroyed": number
                "first": number
              }
              "Keep": {
                "lost": number
                "destroyed": number
                "first": number
              }
              "Fort Well": {
                "lost": number
                "destroyed": number
                "first": number
              }
              "Fort Tower": {
                "lost": number
                "destroyed": number
                "first": number
              }
              "Keep Well": {
                "lost": number
                "destroyed": number
                "first": number
              }
              "Fort": {
                "lost": number
                "destroyed": number
                "first": number
              }
            }
            "KDA": number
            "PPK": number
            "timeTo10": number
            "totals": {
              "DamageTaken": number
              "CreepDamage": number
              "Healing": number
              "HeroDamage": number
              "MinionDamage": number
              "SelfHealing": number
              "SiegeDamage": number
              "ProtectionGivenToAllies": number
              "TeamfightDamageTaken": number
              "TeamfightHealingDone": number
              "TeamfightHeroDamage": number
              "TimeCCdEnemyHeroes": number
              "TimeRootingEnemyHeroes": number
              "TimeSpentDead": number
              "TimeStunningEnemyHeroes": number
              "TimeSilencingEnemyHeroes": number
              "avgTimeSpentDead": number
              "timeDeadPct": number
            }
            "levelAdvTime": number
            "maxLevelAdv": number
            "avgLevelAdv": number
            "levelAdvPct": number
            "uptime": {
              "time": number
              "heroes": number
            }[]
            "uptimeHistogram": {
              [key: string]: number
            }
            "wipes": number
            "avgHeroesAlive": number
            "aces": number
            "timeWithHeroAdv": number
            "pctWithHeroAdv": number
            "passiveXPRate": number
            "passiveXPDiff": number
            "passiveXPGain": number
          }
        }
      }
      "winner": number
      "winningPlayers": string[],
      "messages": {
        "type": number
        "player": string
        "team": number
        "recipient": number
        "loop": number
        "time": number
        "text": string
      }[]
      "levelAdvTimeline": {
        "start": number
        "end": number
        "levelDiff": number
        "length": number
      }[]
      "firstPickWin": boolean
      "firstObjective": 0|1
      "firstObjectiveWin": boolean
      "firstFort": 0|1
      "firstKeep": 0|1
      "firstFortWin": boolean
      "firstKeepWin": boolean
    }
    "players": {
      [key: string]: {
        "hero": string
        "name": string
        "uuid": number
        "region": number
        "realm": number
        "tag": number
        "team": 0|1,
        "ToonHandle": string
        "gameStats": {
          "awards": [],
          "Takedowns": number
          "Deaths": number
          "TownKills": number
          "SoloKill": number
          "Assists": number
          "MetaExperience": number
          "Level": number
          "TeamTakedowns": number
          "ExperienceContribution": number
          "Healing": number
          "SiegeDamage": number
          "StructureDamage": number
          "MinionDamage": number
          "HeroDamage": number
          "MercCampCaptures": number
          "WatchTowerCaptures": number
          "SelfHealing": number
          "TimeSpentDead": number
          "TimeCCdEnemyHeroes": number
          "CreepDamage": number
          "SummonDamage": number
          "Tier1Talent": number
          "Tier2Talent": number
          "Tier3Talent": number
          "Tier4Talent": number
          "Tier5Talent": number
          "Tier6Talent": number
          "Tier7Talent": number
          "DamageTaken": number
          "DamageSoaked": number
          "Role": number
          "KilledTreasureGoblin": number
          "GameScore": number
          "HighestKillStreak": number
          "TeamLevel": number
          "ProtectionGivenToAllies": number
          "TimeSilencingEnemyHeroes": number
          "TimeRootingEnemyHeroes": number
          "TimeStunningEnemyHeroes": number
          "ClutchHealsPerformed": number
          "EscapesPerformed": number
          "VengeancesPerformed": number
          "TeamfightEscapesPerformed": number
          "OutnumberedDeaths": number
          "TeamfightHealingDone": number
          "TeamfightDamageTaken": number
          "TeamfightHeroDamage": number
          "OnFireTimeOnFire": number
          "LunarNewYearSuccesfulArtifactTurnIns": number
          "TimeOnPoint": number
          "CageUnlocksInterrupted": number
          "GardenSeedsCollectedByPlayer": number
          "TeamWinsDiablo": number
          "TeamWinsFemale": number
          "TeamWinsMale": number
          "TeamWinsStarCraft": number
          "TeamWinsWarcraft": number
          "WinsWarrior": number
          "WinsAssassin": number
          "WinsSupport": number
          "WinsSpecialist": number
          "WinsStarCraft": number
          "WinsDiablo": number
          "WinsWarcraft": number
          "WinsMale": number
          "WinsFemale": number
          "PlaysStarCraft": number
          "PlaysDiablo": number
          "PlaysOverwatch": number
          "PlaysWarCraft": number
          "PlaysNexus": number
          "PlaysOverwatchOrNexus": number
          "PlaysWarrior": number
          "PlaysAssassin": number
          "PlaysSupport": number
          "PlaysSpecialist": number
          "PlaysMale": number
          "PlaysFemale": number
          "LunarNewYearEventCompleted": number
          "StarcraftDailyEventCompleted": number
          "StarcraftPiecesCollected": number
          "LunarNewYearRoosterEventCompleted": number
          "TouchByBlightPlague": number
          "PachimariMania": number
          "LessThan4Deaths": number
          "LessThan3TownStructuresLost": number
          "PhysicalDamage": number
          "SpellDamage": number
          "Multikill": number
          "MinionKills": number
          "RegenGlobes": number
          "DamageDoneToImmortal": number
          "KDA": number
          "damageDonePerDeath": number
          "damageTakenPerDeath": number
          "healingDonePerDeath": number
          "DPM": number
          "HPM": number
          "XPM": number
          "KillParticipation": number
          "length": number
          "passiveXPRate": number
          "passiveXPDiff": number
          "passiveXPGain": number
          "aces": number
          "wipes": number
          "timeWithHeroAdv": number
          "pctWithHeroAdv": number
          "levelAdvTime": number
          "levelAdvPct": number
        }
      }
      "talents": {
        "Tier1Choice": string
        "Tier2Choice": string
        "Tier3Choice": string
        "Tier4Choice": string
        "Tier5Choice": string
        "Tier6Choice": string
      }
      "takedowns": {
        "loop": number
        "time": number
        "x": number
        "y": number
        "killers": {
          "player": string
          "hero": string
        }[]
        "victim": {
          "player": string
          "hero": string
        }[]
      }
      "deaths": {
        "loop": number
        "time": number
        "x": number
        "y": number
        "killers": {
          "player": string
          "hero": string
        }[],
        "victim": {
          "player": string
          "hero": string
        }
      }[]
    }
  }

  export enum ReplayStatus {
    OK = 1,
    Unsupported = 0,
    /** This is a holdover from when the parser was part of Stats of the Storm */
    Duplicate = -1,
    /** If you get this exception and it's not about a missing filepath, please report it. This indicates a general internal exception that should probably be fixed. */
    Failure = -2,
    /** Brawls are included in unsupported maps. */
    UnsupportedMap = -3,
    /** AI games will not parse. */
    ComputerPlayerFound = -4,
    /** Partial replay detected. If the parser does not see a core destroyed it will be unable to find a winner and this status will be returned. */
    Incomplete = -5,
    /** Related to Incomplete. Usually returned if a winner is unable to be determined from some very old replays, or some recent incomplete replays. */
    TooOld = -6
  }

  export enum ReplayGameMode {
    AI = 50021,
    Practice = 50041,
    QuickMatch = 50001,
    Brawl = 50031,
    UnrankedDraft = 50051,
    HeroLeague = 50061,
    TeamLeague = 50071,
    StormLeague = 50091,
    Custom = -1
  }

  /** Values in this enum correspond with flags given to the reference Blizzard/heroprotocol implementation. */
  export enum ReplayDataType {
    game = 'gameevents',
    message = 'messageevents',
    tracker = 'trackerevents',
    attribute = 'attributeevents',
    header = 'header',
    details = 'details',
    init = 'initdata',
    stats = 'stats'
  }

  /**
   * Main replay processing function.
   * @param file String containing the path to the replay file.
   * @param options Optional object that can contain the following
   * @returns
   * JSON object containing `status`, `match`, and `players` keys.
   * status integer status code indicating success or failure. You want to see a `1` here. See `Parser.ReplayStatus` for possible values of this field.
   * match contains information about the parsed match. It gathers team-specific data, and can be linked back to players via the player's ToonHandles.
   * players contains 10 objects. Each object is keyed by the player's ToonHandle (unique identifier). These objects contain player-specific statistics.
   * The best way to see the results of these files is to run the parser and inspect the output yourself.
   */
  export function processReplay(file: string, options?: ParserProcessReplayOption): ParserProcessReplayReturn
  
  /**
   * Extract specific replay data. Data is returned unprocessed.
   * @param file the path to the replay file
   * @param requestedData Array containing keys specifying which data to get. Available values are in `Parser.ReplayDataType`. You can also use shortcuts `Parser.CommonReplayData` (all data except game events) and `Parser.AllReplayData` as arguments.
   * @param options object containing the following possible values:
   */
  export function parse(file: string, requestedData: ReplayDataType[], options: {
    /** doesn't exist by default. If this key is present, the replay data will also be written to the specified file. */
    saveToFile: string
  }): {
    [key in ReplayDataType]: any
  }
  
  /**
   * Returns basic information about the match.
   * @param path to the replay file
   */
  export function getHeader(file: string): any
}