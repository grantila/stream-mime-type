[![npm version][npm-image]][npm-url]
[![downloads][downloads-image]][npm-url]
[![build status][build-image]][build-url]
[![coverage status][coverage-image]][coverage-url]


# stream-mime-type

Get the mime type of a stream by inspecting its header. The stream is being consumed, but a new readable stream is returned together with the mime type.

Supports both [Node.js ReadableStream](https://nodejs.org/api/stream.html) (of Buffers, not *object-mode*) and [Streams API ReadableStream](https://developer.mozilla.org/docs/Web/API/Streams_API) of [typed arrays](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) (such as e.g. [Uint8Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)), [ArrayBuffers](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) or [DataViews](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView).

The first couple of kilobytes are necessary to deduce the filetype. After that, the returned promise is resolved with a new stream (from the beginning of the input stream) and the mime type.

It also supports buffers (of type `Uint8Array`, such as [Node.js Buffers](https://nodejs.org/api/buffer.html)) and file descriptors instead of streams.


## Versions

From v2:
 * This package is a pure ESM, no CommonJS support


# Usage

`getMimeType` takes either a number (file descriptor), a buffer (`Uint8Array`) or a readable stream as first argument. The returned promise contains the mime type and a new readable stream (if the input was a stream) for further streaming, on the form:

```ts
interface ReturnType {
    stream: ReadableStream; // If the input was a stream, otherwise undefined
    mime: string;
}
```

To aid finding the mime-type if it is unclear given the *content* of the stream (or buffer or file descriptor), a filename can be provided, in which case a mime-type can be deduced as a fallback.


## API

```ts
getMimeType( stream | buffer | fd, opts? ): Promise<ReturnType>;
```


## Stream example

```ts
import { getMimeType } from 'stream-mime-type'

let inStream: NodeJS.ReadableStream; // Get from somewhere
const { stream, mime } = await getMimeType( inStream );

console.log(mime); // e.g. 'image/png'
stream.pipe(outStream); // Keep streaming
```


## Buffer example

```ts
import { readFileSync } from 'fs'
import { getMimeType } from 'stream-mime-type'

const imageBuffer = readFileSync("file.png", null); // Returns a Buffer
const { mime } = await getMimeType( imageBuffer, { filename: "file.png" } );

console.log(mime); // 'image/png'
```


## File descriptor

```ts
import { openSync } from 'fs'
import { getMimeType } from 'stream-mime-type'

const fd = openSync("file.png", "r");
const { mime } = await getMimeType( fd, { filename: "file.png" } );

console.log(mime); // 'image/png'
```


## Options

The second argument to `getMimeType` is an options object on the format:

```ts
interface GetMimeTypeOptions {
    strict?: boolean;
    filename?: string;
}
```

The `filename` can provide a hint to the content type if it's not found by the file contents.

The `strict` can be set to `true` (defaults to `false`) in which case the result will not fallback to `application/octet-stream` if no other mime type was found. The return value will be `undefined` instead.



[npm-image]: https://img.shields.io/npm/v/stream-mime-type.svg
[npm-url]: https://npmjs.org/package/stream-mime-type
[downloads-image]: https://img.shields.io/npm/dm/stream-mime-type.svg
[build-image]: https://img.shields.io/github/actions/workflow/status/grantila/stream-mime-type/master.yml?branch=master
[build-url]: https://github.com/grantila/stream-mime-type/actions?query=workflow%3AMaster
[coverage-image]: https://coveralls.io/repos/github/grantila/stream-mime-type/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/grantila/stream-mime-type?branch=master
