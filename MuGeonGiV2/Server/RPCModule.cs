﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using MuGeonGiV2.Core;
using Nancy;

namespace MuGeonGiV2.Server
{
    public class RpcModule : MyModule
    {
        public RpcModule() : base("/{Type}/{Uuid}")
        {
            Post["/{MethodName}"] = parameters =>
            {
                object caller;
                
                if (parameters.Type == "jack")
                {
                    if (!Jack.TryGet(parameters.Uuid, out Jack jack))
                    {
                        return new NotFoundResponse();
                    }
                    caller = jack;
                }
                else
                {
                    if (!Instrument.TryGet(parameters.Uuid, out Instrument instrument))
                    {
                        return new NotFoundResponse();
                    }
                    caller = instrument;
                }

                var type = caller.GetType();
                MethodInfo method = type.GetMethod(parameters.MethodName);
                method.Invoke(caller, null);
                return new Response();
            };
        }
    }
}