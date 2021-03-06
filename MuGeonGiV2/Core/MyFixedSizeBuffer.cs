﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MuGeonGiV2.Core
{
    /// <summary>
    /// Represents a read- and writeable buffer which can hold a specified number of elements. 
    /// </summary>
    /// <typeparam name="T">Specifies the type of the elements to store.</typeparam>
    public class MyFixedSizeBuffer<T> : IDisposable
    {
        private T[] _buffer;
        private int _bufferedElements;
        private int _writeOffset;
        private int _readOffset;
        private readonly object _lockObj = new object();

        /// <summary>
        /// Initializes a new instance of the <see cref="FixedSizeBuffer{T}"/> class.
        /// </summary>
        /// <param name="bufferSize">Size of the buffer.</param>
        public MyFixedSizeBuffer(int bufferSize)
        {
            _buffer = new T[bufferSize];
        }

        /// <summary>
        /// Adds new data to the internal buffer.
        /// </summary>
        /// <param name="buffer">Array which contains the data.</param>
        /// <param name="offset">Zero-based offset in the <paramref name="buffer"/> (specified in "elements").</param>
        /// <param name="count">Number of elements to add to the internal buffer.</param>
        /// <returns>Number of added elements.</returns>
        public int Write(T[] buffer, int offset, int count)
        {
            var written = 0;

            lock (_lockObj)
            {
                var lastWrittenOffset = (_writeOffset + count - 1) % _buffer.Length;
                var offset1 = Math.Max(lastWrittenOffset - count + 1, 0);
                var length1 = lastWrittenOffset - offset1 + 1;
                Array.Copy(buffer, offset + count - length1, _buffer, offset1, length1);
                written += length1;

                if (length1 < _buffer.Length && count > length1)
                {
                    var remainedLength = count - length1;
                    var offset2 = _buffer.Length - remainedLength <= lastWrittenOffset
                        ? lastWrittenOffset
                        : _buffer.Length - remainedLength;
                    var length2 = _buffer.Length - offset2;
                    Array.Copy(buffer, offset + count - length1 - length2, _buffer, offset2, length2);
                    written += length2;
                }
                _bufferedElements = Math.Min(_bufferedElements + written, _buffer.Length);
                _writeOffset = (lastWrittenOffset + 1) % _buffer.Length;
            }

            return written;
        }

        /// <summary>
        ///     Reads a sequence of elements from the internal buffer of the <see cref="FixedSizeBuffer{T}" />.
        /// </summary>
        /// <param name="buffer">
        ///     An array of elements. When this method returns, the <paramref name="buffer" /> contains the specified
        ///     array with the values between <paramref name="offset" /> and (<paramref name="offset" /> +
        ///     <paramref name="count" /> - 1) replaced by the elements read from the internal buffer.
        /// </param>
        /// <param name="offset">
        ///     The zero-based offset in the <paramref name="buffer" /> at which to begin storing the data
        ///     read from the internal buffer.
        /// </param>
        /// <param name="count">The maximum number of elements to read from the internal buffer.</param>
        /// <returns>The total number of elements read into the <paramref name="buffer"/>.</returns>
        public int Read(T[] buffer, int offset, int count)
        {
            int read = 0;

            lock (_lockObj)
            {
                count = Math.Min(count, _bufferedElements);
                int length = Math.Min(count, _buffer.Length - _readOffset);
                Array.Copy(_buffer, _readOffset, buffer, offset, length); //copy to buffer
                read += length;
                _readOffset += read;
                _readOffset = _readOffset % _buffer.Length;

                if (read < count)
                {
                    Array.Copy(_buffer, _readOffset, buffer, offset + read, count - read);
                    _readOffset += (count - read);
                    read += (count - read);
                }

                _bufferedElements -= read;
            }

            return read;
        }

        /// <summary>
        /// Gets the size of the internal buffer.
        /// </summary>
        public int Length { get { return _buffer.Length; } }

        /// <summary>
        /// Gets the number of buffered elements.
        /// </summary>
        public int Buffered { get { return _bufferedElements; } }

        /// <summary>
        /// Clears the internal buffer.
        /// </summary>
        public void Clear()
        {
            Array.Clear(_buffer, 0, _buffer.Length);
            //reset all offsets
            _bufferedElements = 0;
            _writeOffset = 0;
            _readOffset = 0;
        }

        private bool _disposed;

        /// <summary>
        /// Disposes the <see cref="FixedSizeBuffer{T}"/> and releases the internal used buffer.
        /// </summary>
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        /// <summary>
        /// Disposes the <see cref="FixedSizeBuffer{T}"/> and releases the internal used buffer.
        /// </summary>
        /// <param name="disposing">True to release both managed and unmanaged resources; false to release only unmanaged resources.</param>
        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                _buffer = null;
            }
            _disposed = true;
        }

        /// <summary>
        /// Default destructor which calls the <see cref="Dispose(bool)"/> method.
        /// </summary>
        ~MyFixedSizeBuffer()
        {
            Dispose(false);
        }
    }
}