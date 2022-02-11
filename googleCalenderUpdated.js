let maxEvents = 50;

let nextPageToken = "";

let maxUsers = 3;

async function usersFullSync({ dataStore, client }) {
  do {
    const responseData = await client.fetch(
      `admin/directory/v1/users?customer=my_customer&projection=full&viewType=admin_view&maxResults=${maxUsers}&pageToken=${nextPageToken}`
    );

    if (!responseData.ok) {
      throw new Error(
        `Events sync failed ${responseData.status}:${responseData.statusText}.`
      );
    }
    const nextData = await responseData.json();

    for (const user of nextData.users) {
      const userData = {
        agreed_To_Terms: user.agreedToTerms,
        archived: user.archived,
        change_Password_At_Next_Login: user.changePasswordAtNextLogin,
        cocustomer_Id: user.customerId,
        etag: user.etag,
        id: user.id,
        include_In_Global_Address_List: user.includeInGlobalAddressList,
        is_Admin: user.isAdmin,
        is_Enforced_In_2_Sv: user.isEnforcedIn2Sv,
        is_Mailbox_Setup: user.isMailboxSetup,
        kind: user.kind,
        name_Family_Name: user.name.familyName,
        name_Full_Name: user.name.fullName,
        nname_Given_Name: user.name.givenName,
        org_Unit_Path: user.orgUnitPath,
        primary_Email: user.primaryEmail,
        recovery_Email: user.recoveryEmail,
        suspended: user.suspended,
      };

      dataStore.save("users", userData);
      await Events(dataStore, client, user.primaryEmail);
    }

    if (nextData.nextPageToken) {
      nextPageToken = await nextData.nextPageToken;
    } else {
      break;
    }
  } while (nextPageToken != true);
}
async function Events(dataStore, client, primaryEmail) {
  let i = 1;
  do {
    const responseDataEvent = await client.fetch(
      `calendar/v3/calendars/${primaryEmail}/events?maxResults=${maxEvents}&showDeleted=false&singleEvents=true&orderBy=startTime&pageToken=${nextPageToken}`
    );
    i++;
    if (!responseDataEvent.ok) {
      throw new Error(
        `Events sync failed ${responseDataEvent.status}:${responseDataEvent.statusText}.`
      );
    }

    let dataEvent = await responseDataEvent.json();

    for (const items of dataEvent.items) {
      const userDataEvent = {
        summary: items.summary,
        id: items.id,
        updated: items.updated,
        organizerSelf: items.self,
        status: items.status,
        conferencedDataSignature: items.signature,
        htmlLink: items.htmlLink,
        created: items.created,
        location: items.location,
        creator: items.email,
        organizer: items.email,
        remainders: items.useDefault,
        startDateTime: items.dateTime,
        startTimeZone: items.timeZone,
        end: items.dateTime,
        endTimeZone: items.timeZone,
        hangoutLink: items.hangoutLink,
        iCalUID: items.iCalUID,
        sequence: items.sequence,
        attendees: items?.attendees?.email ?? null,
        resStatus: items?.attendees?.responseStatus ?? null,
        guestCanModify: items.guestsCanModify,
        recurringEventid: items.recurringEventId,
        originalDateTime: items.dateTime,
        conferenceId: items.conferenceId,
        iconUri: items?.conferenceSolution?.iconUri ?? null,
        krytype: items.type,
        name: items.name,
        description: items.description,
        private_Copy: items.privateCopy,
        startDate: items.startDate,
        endDate: items.endDate,
        organizer_Display_Name: items.displayName,
      };
      dataStore.save("events", userDataEvent);
    }
    if (dataEvent.nextPageToken) {
      nextPageToken = dataEvent.nextPageToken;
    } else {
      break;
    }
  } while (nextPageToken != true && i > 3);
}

async function createEvents({ dataStore, serviceClient, actionParameters }) {
  const payLoad = {
    end: {
      date: actionParameters.enddate,
      datetime: actionParameters.enddatetime,
      timeZone: actionParameters.endtimeZone,
    },
    start: {
      date: actionParameters.startdate,
      datetime: actionParameters.startdatetime,

      timeZone: actionParameters.starttimezone,
    },
    summary: actionParameters.summary,
  };

  const response = await serviceClient.fetch(
    `calendar/v3/calendars/${actionParameters.primaryEmail}/events?sendUpdates=all&conferenceDataVersion=0`,
    {
      method: "POST",
      body: JSON.stringify(payLoad),
    }
  );
  await Events(dataStore, serviceClient, actionParameters.primaryEmail);
}

integration.define({
  synchronizations: [
    {
      name: "GoogleCalender",
      fullSyncFunction: usersFullSync,
    },
  ],

  model: {
    tables: [
      {
        name: "users",
        columns: [
          {
            name: "agreed_To_Terms",
            type: "BOOLEAN",
          },
          {
            name: "archived",
            type: "BOOLEAN",
          },
          {
            name: "change_Password_At_Next_Login",
            type: "BOOLEAN",
          },
          {
            name: "customer_Id",
            type: "STRING",
            length: 255,
          },
          {
            name: "etag",
            type: "STRING",
            length: 255,
          },
          {
            name: "id",
            type: "STRING",
            length: 255,
            primaryKey: true,
          },
          {
            name: "include_In_Global_Address_List",
            type: "BOOLEAN",
          },
          {
            name: "is_Admin",
            type: "BOOLEAN",
          },
          {
            name: "is_Enforced_In_2_Sv",
            type: "BOOLEAN",
          },
          {
            name: "is_Mailbox_Setup",
            type: "BOOLEAN",
          },
          {
            name: "kind",
            type: "STRING",
            length: 255,
          },
          {
            name: "name_Family_Name",
            type: "STRING",
            length: 255,
          },
          {
            name: "name_Full_Name",
            type: "STRING",
            length: 255,
          },
          {
            name: "nname_Given_Name",
            type: "STRING",
            length: 255,
          },
          {
            name: "org_Unit_Path",
            type: "STRING",
            length: 255,
          },
          {
            name: "primary_Email",
            type: "STRING",
            length: 255,
            primaryKey: true,
          },
          {
            name: "recovery_Email",
            type: "STRING",
            length: 255,
          },
          {
            name: "suspended",
            type: "BOOLEAN",
          },
        ],
      },
      {
        name: "events",
        columns: [
          {
            name: "summary",
            type: "STRING",
            length: 255,
          },
          {
            name: "organizerSelf",
            type: "BOOLEAN",
          },
          {
            name: "conferenceDataSignature",
            type: "STRING",
            length: 255,
          },
          {
            name: "recurringEvent",
            type: "STRING",
            length: 255,
          },
          {
            name: "updated",
            type: "DATETIME",
          },
          {
            name: "startTimeZone",
            type: "STRING",
            length: 255,
          },

          {
            name: "created",
            type: "DATETIME",
          },
          {
            name: "status",
            type: "STRING",
            length: 255,
          },
          {
            name: "creator",
            type: "STRING",
            length: 255,
          },
          {
            name: "id",
            type: "STRING",
            length: 255,
            primaryKey: true,
          },
          {
            name: "description",
            type: "STRING",
            length: 1000,
          },
          {
            name: "end",
            type: "DATETIME",
          },
          {
            name: "iCalUid",
            type: "STRING",
            length: 255,
          },
          {
            name: "endTimeZone",
            type: "STRING",
            length: 255,
          },
          {
            name: "originalDateTime",
            type: "DATETIME",
          },
          {
            name: "conferenceId",
            type: "STRING",
            length: 255,
          },
          {
            name: "htmlLink",
            type: "STRING",
            length: 255,
          },
          {
            name: "iconUri",
            type: "STRING",
            length: 255,
          },
          {
            name: "organizer",
            type: "STRING",
            length: 255,
          },
          {
            name: "startDateTime",
            type: "DATETIME",
          },
          {
            name: "sequence",
            type: "INTEGER",
          },
          {
            name: "resStatus",
            type: "STRING",
            length: 255,
          },
          {
            name: "guestCanModify",
            type: "BOOLEAN",
          },
          {
            name: "startDate",
            type: "DATETIME",
          },
          {
            name: "endDate",
            type: "DATETIME",
          },
          {
            name: "private_Copy",
            type: "BOOLEAN",
          },
          {
            name: "krytype",
            type: "STRING",
            length: 255,
          },
          {
            name: "name",
            type: "STRING",
            length: 255,
          },
          {
            name: "organizer_Display_Name",
            type: "STRING",
            length: 255,
          },
          {
            name: "hangoutLink",
            type: "STRING",
            length: 255,
          },
          {
            name: "location",
            type: "STRING",
            length: 255,
          },
          {
            name: "attendees",
            type: "STRING",
            length: 255,
          },
        ],
      },
    ],
  },
  actions: [
    {
      name: "createEvents",
      parameters: [
        {
          name: "startdate",
          type: "STRING",
          required: true,
        },
        {
          name: "primaryEmail",
          type: "STRING",
          required: true,
        },
        {
          name: "starttimezone",
          type: "STRING",
          required: true,
        },
        {
          name: "startdatetime",
          type: "STRING",
          required: true,
        },
        {
          name: "enddate",
          type: "STRING",
          required: true,
        },
        {
          name: "endtimezone",
          type: "STRING",
          required: true,
        },
        {
          name: "enddatetime",
          type: "STRING",
          required: true,
        },
        {
          name: "summary",
          type: "STRING",
          required: true,
        },
      ],
      function: createEvents,
    },
  ],
});
