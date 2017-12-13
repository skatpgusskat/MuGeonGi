﻿using MuGeonGiV2.Core;
using Nancy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MuGeonGiV2.Server
{
    public class SpeakerModule : MyModule
    {
        public SpeakerModule() : base("/speaker/{uuid}")
        {
            Get["/devices"] = parameters => {
                if (Instrument.TryGet(parameters.uuid, out Instrument instrument))
                {
                    var speaker = (Speaker)instrument;
                    var devices = speaker.AvailableDevices.Select(device => device.ToString());
                    return Response.AsJson(devices);
                }
                return new NotFoundResponse();
            };
            Post["/device/{deviceName}"] = parameters => {
                if (Instrument.TryGet(parameters.uuid, out Instrument instrument))
                {
                    var speaker = (Speaker)instrument;
                    speaker.SetDevice((string)parameters.deviceName);
                    return new Response();
                }
                return new NotFoundResponse();
            };
        }
    }
}
