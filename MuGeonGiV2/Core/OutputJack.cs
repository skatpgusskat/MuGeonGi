﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CSCore.SoundIn;
using CSCore.Streams;
using CSCore.Streams.SampleConverter;
using CSCore;

namespace MuGeonGiV2.Core
{
    public class OutputJack : IJack
    {
        private WasapiCapture SoundIn;
        private IWaveSource WaveSource;

        public OutputJack(WasapiCapture soundIn)
        {
            SoundIn = soundIn;
            var soundInSource = new SoundInSource(SoundIn);
            WaveSource = new SampleToPcm32(soundInSource.ToSampleSource());
        }

        public void Connect(Cable cable)
        {
            cable.PutSoundInSource(WaveSource);
        }
    }
}
