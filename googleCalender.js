const max = 50;
async function UsersFullSync({ dataStore, client }) {
  console.log(" sync started");
  const responsedata = await client.fetch("admin/directory/v1/users?customer=my_customer&projection=full&viewType=admin_view");
  //console.log(JSON.stringify(responsedata));
  if (!responsedata.ok) {
    throw new Error(
      `Accounts sync failed ${responsedata.status}:${responsedata.statusText}.`
    );
  }
  let data = await responsedata.json();
  // console.log(JSON.stringify(data));

  for (let user of data.users) {
    // console.log(JSON.stringify(user));
    let user_data = {
      agreed_to_terms: user.agreedToTerms,
      archived: user.archived,
      change_password_at_next_login: user.changePasswordAtNextLogin,
      cocustomer_id: user.customerId,
      etag: user.etag,
      id: user.id,
      include_in_global_address_list: user.includeInGlobalAddressList,
      is_admin: user.isAdmin,
      is_enforced_in_2_sv: user.isEnforcedIn2Sv,
      is_mailbox_setup: user.isMailboxSetup,
      kind: user.kind,
      name_family_name: user.name.familyName,
      name_full_name: user.name.fullName,
      nname_given_name: user.name.givenName,
      org_unit_path: user.orgUnitPath,
      primary_email: user.primaryEmail,
      recovery_email: user.recoveryEmail,
      suspended: user.suspended,
    };
    // console.log(JSON.stringify(user_data))
    //console.log(`user.primaryEmail${JSON.stringify(user.primaryEmail)}`);
    dataStore.save("users", user_data);

    await Events(dataStore, client, user.primaryEmail);

  }
}
//const primaryEmail = ["user.primaryEmail"];
async function Events(dataStore, client, primaryEmail) {
 // console.log("primaryEmail");
  const responsedata2 = await client.fetch(`calendar/v3/calendars/${primaryEmail}/events?maxResults=${max}&showDeleted=false&singleEvents=true&orderBy=startTime`);
  console.log(JSON.stringify(responsedata2));

  // console.log(error);
  if (!responsedata2.ok) {
    throw new Error(
      `Accounts sync failed ${responsedata2.status}:${responsedata2.statusText}.`
    );
  }
  //console.log(error);
  let data2 = await responsedata2.json();
  console.log(JSON.stringify(data2));
  for (let ev of data2.items) {
    //console.log(JSON.stringify(ev?.attendees?.email))
    let user_data2 = {
      //kind: ev.kind,
      // etag:ev.etag,
      summary: ev.summary,
      id: ev.id,
      updated: ev.updated,
      organizerself: ev.self,
      status: ev.status,
      conferencedatasignature: ev.signature,
      htmllink: ev.htmlLink,
      created: ev.created,
      location: ev.location,
      creator: ev.email,
      organizer: ev.email,
      remainders: ev.useDefault,
      startdatetime: ev.dateTime,
      starttimezone: ev.timeZone,
      end: ev.dateTime,
      endtimezone: ev.timeZone,
      hangoutlink: ev.hangoutLink,
      iCalUID: ev.iCalUID,
      sequence: ev.sequence,
      attendees: ev?.attendees?.email ?? null,
      resstatus: ev?.attendees?.responseStatus ?? null,
      guestcanmodify: ev.guestsCanModify,
      recurringeventid: ev.recurringEventId,
      originaldatetime: ev.dateTime,
      conferenceid: ev.conferenceId,
      iconuri: ev?.conferenceSolution?.iconUri ?? null,
      krytype: ev.type,
      name: ev.name,
      description: ev.description,
      private_copy: ev.privateCopy,
      startDate: ev.startDate,
      endDate: ev.endDate,
      organizer_display_name: ev.displayName



    };
    //  console.log(JSON.stringify(user_data2))
    //
    dataStore.save("events", user_data2);
  }
}


async function create_events({ dataStore, serviceClient, actionParameters }) {
  console.log(actionParameters.primaryEmail);
  const payload = ({

    end: {
      date: actionParameters.enddate,
      datetime: actionParameters.enddatetime,
      timeZone: actionParameters.endtimeZone
    },
    start: {
      date: actionParameters.startdate,
      datetime: actionParameters.startdatetime,

      timeZone: actionParameters.starttimezone,
    },
    summary: actionParameters.summary,

  })


  const response = await serviceClient.fetch((`calendar/v3/calendars/${actionParameters.primaryEmail}/events?sendUpdates=all&conferenceDataVersion=0`), {
    method: "POST",
    body: JSON.stringify(payload)

  }) 
    Events(dataStore, serviceClient, actionParameters.primaryEmail)
    
}




integration.define({
  synchronizations: [
    {
      name: "GoogleCalender",
      fullSyncFunction: UsersFullSync
    },
  ],

  model: {
    tables: [
      {
        name: "users",
        columns: [
          {
            name: "agreed_to_terms",
            type: "BOOLEAN",
          },
          {
            name: "archived",
            type: "BOOLEAN",
          },
          {
            name: "change_password_at_next_login",
            type: "BOOLEAN",
          },

          {
            name: "customer_id",
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
            name: "include_in_global_address_list",
            type: "BOOLEAN",
          },

          {
            name: "is_admin",
            type: "BOOLEAN",
          },

          {
            name: "is_enforced_in_2_sv",
            type: "BOOLEAN",
          },

          {
            name: "is_mailbox_setup",
            type: "BOOLEAN",
          },
          {
            name: "kind",
            type: "STRING",
            length: 255,
          },

          {
            name: "name_family_name",
            type: "STRING",
            length: 255,
          },
          {
            name: "name_full_name",
            type: "STRING",
            length: 255,
          },
          {
            name: "nname_given_name",
            type: "STRING",
            length: 255,
          },
          {
            name: "org_unit_path",
            type: "STRING",
            length: 255,
          },
          {
            name: "primary_email",
            type: "STRING",
            length: 255,
            primaryKey: true

          },
          {
            name: "recovery_email",
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
        name: 'events',
        columns: [
          {
            name: 'summary',
            type: 'STRING',
            length: 255
          },
          {
            name: 'organizerself',
            type: 'BOOLEAN'

          },
          {
            name: 'conferencedatasignature',
            type: 'STRING',
            length: 255
          },
          {
            name: 'recurringevent',
            type: 'STRING',
            length: 255
          },
          {
            name: 'updated',
            type: 'DATETIME'

          },
          {
            name: 'starttimezone',
            type: 'STRING',
            length: 255
          },
          {
            name: 'created1',
            type: 'DATETIME'

          },
          {
            name: 'status',
            type: 'STRING',
            length: 255
          },
          {
            name: 'creator',
            type: 'STRING',
            length: 255
          },
          {
            name: 'id',
            type: 'STRING',
            length: 255,
            primaryKey: true
          },
          {
            name: 'description',
            type: 'STRING',
            length: 1000
          },
          {
            name: 'end',
            type: 'DATETIME'
          },
          {
            name: 'iCalUid',
            type: 'STRING',
            length: 255
          },
          {
            name: 'endtimezone',
            type: 'STRING',
            length: 255
          },
          {
            name: 'etag',
            type: 'STRING',
            length: 255
          },

          {
            name: 'originaldatetime',
            type: 'DATETIME'
          },
          {
            name: 'conferenceid',
            type: 'STRING',
            length: 255

          },
          {
            name: 'htmllink',
            type: 'STRING',
            length: 255

          },
          {
            name: 'iconuri',
            type: 'STRING',
            length: 255

          },
          {
            name: 'organizer',
            type: 'STRING',
            length: 255
          },
          {
            name: 'startdatetime',
            type: 'DATETIME'
          },
          {
            name: 'sequence',
            type: 'INTEGER',
          },

          {
            name: 'resstatus',
            type: 'STRING',
            length: 255
          },
          {
            name: 'guestcanmodify',
            type: 'BOOLEAN'
          },
          {
            name: "startDate",
            type: 'DATETIME'
          },
          {
            name: "endDate",
            type: 'DATETIME'
          },
          {
            name: "private_copy",
            type: "BOOLEAN"
          },
          {
            name: "krytype",
            type: "STRING",
            length: 255
          },
          {
            name: "name",
            type: "STRING",
            length: 255
          }
        ],

      },
    ],
  },
  actions: [
    {
      name: "create_events",
      parameters: [
        {
          name: "startdate",
          type: "STRING",
          required: true
        },
        {
          name: "primaryEmail",
          type: "STRING",
          required: true  
        },
        {
          name: "starttimezone",
          type: "STRING",
          required: true
        },
        {
          name: "startdatetime",
          type: "STRING",
          required: true
        },
        {
          name: "enddate",
          type: "STRING",
          required: true
        },
        {
          name: "endtimezone",
          type: "STRING",
          required: true
        },
        {
          name: "enddatetime",
          type: "STRING",
          required: true
        },

        {
          name: "summary",
          type: "STRING",
          required: true
        },

      ],
      function: create_events
    },
  ],

});