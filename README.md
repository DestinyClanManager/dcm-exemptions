# dcm-exemptions

[![Build status](https://dev.azure.com/heymrcarter/Destiny%20Clan%20Manager/_apis/build/status/DCM-Exemptions)](https://dev.azure.com/heymrcarter/Destiny%20Clan%20Manager/_build/latest?definitionId=-1)
![Release status](https://vsrm.dev.azure.com/heymrcarter/_apis/public/Release/badge/7e5f3784-dda9-4bf0-9c99-7bde292990b9/8/22)

> Exemption microservice for Destiny Clan Manager

## Endpoints

### `getExemptions`

Returns exemption profile for the given clan

|                    |                                                 |
| ------------------ | ----------------------------------------------- |
| **Trigger**        | `GET /exemptions/{clanId}`                      |
| **Request body**   | none                                            |
| **Response body**  | [`ClanExemptionProfile`](#ClanExemptionProfile) |
| **Success status** | `200`                                           |
| **Error status**   | `500`                                           |

### `createExemption`

Creates an exemption for a member in the given clan

|                    |                             |
| ------------------ | --------------------------- |
| **Trigger**        | `POST /exemptions/{clanId}` |
| **Request body**   | [`Exemption`](#Exemption)   |
| **Response body**  | [`Exemption`](#Exemption)   |
| **Success status** | `201`                       |
| **Error status**   | `500`                       |

### `editExemption`

Edits an active exemption for the given member

|                    |                                            |
| ------------------ | ------------------------------------------ |
| **Trigger**        | `POST /exemptions/{clanId}/{membershipId}` |
| **Request body**   | [`Exemption`](#Exemption)                  |
| **Response body**  | [`Exemption`](#Exemption)                  |
| **Success status** | `200`                                      |
| **Error status**   | `500`                                      |

## Resources

### `ClanExemptionProfile`

| Property         | Type                                                | Description                                   |
| ---------------- | --------------------------------------------------- | --------------------------------------------- |
| `{membershipId}` | [`MemberExemptionProfile`](#MemberExemptionProfile) | Platform membership id of a given clan member |

### `MemberExemptionProfile`

| Property           | Type                        | Description                                                          |
| ------------------ | --------------------------- | -------------------------------------------------------------------- |
| `history`          | [`[Exemption]`](#Exemption) | An array containing all of the`Exemption` a member has ever received |
| `numberExemptions` | `Number`                    | The total number of exemptions the member has been granted           |
| `membershipId`     | `String`                    | The platform membership id of the given member                       |

### `Exemption`

| Property              | Type     | Description                                                       |
| --------------------- | -------- | ----------------------------------------------------------------- |
| `adminMembershipId`   | `String` | The Bungie.net membership id of the admin removing the member     |
| `adminMembershipType` | `String` | Identifies the membership id as the Bungie.net membership id      |
| `id`                  | `String` | A server generated GUID to identifiy the `Exemption`              |
| `stateDate`           | `Date`   | The date the admin started the exemption period                   |
| `endDate`             | `Date`   | The date the admin chose to end the exemption period              |
| `membershipId`        | `String` | The platform membership id for the member receiving the exemption |
