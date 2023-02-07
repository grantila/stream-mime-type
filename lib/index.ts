import { read } from 'fs'
import { parse as parsePath } from 'path'
import { promisify } from 'util'

import { fileTypeFromBuffer } from 'file-type'
import { lookup as mimeLookup } from 'mime-types'
import streamHead from 'stream-head'


export interface GetMimeTypeOptionsStrict
{
	strict: true;
	filename?: string;
}
export interface GetMimeTypeOptionsNoStrict
{
	strict?: false;
	filename?: string;
}
export type GetMimeTypeOptions =
	| GetMimeTypeOptionsStrict
	| GetMimeTypeOptionsNoStrict;

export interface GetMimeTypeResultStrict
{
	mime: string | undefined;
	stream: undefined;
}
export interface GetMimeTypeResult
{
	mime: string;
	stream: undefined;
}
export interface GetMimeTypeResultStrictWithStream
{
	mime: string | undefined;
	stream: NodeJS.ReadableStream;
}
export interface GetMimeTypeResultWithStream
{
	mime: string;
	stream: NodeJS.ReadableStream;
}

const fsRead = promisify( read );
const fileTypeBufferLength = 4100;
const octetStream = 'application/octet-stream';


function mimeFromFilename( filename?: string ): string | undefined
{
	if ( !filename )
		return undefined;
	const { ext } = parsePath( filename );
	return mimeLookup( ext ) || undefined;
}

async function getMimeTypeOfBuffer(
	data: Uint8Array, options: GetMimeTypeOptionsStrict
): Promise< string | undefined >;
async function getMimeTypeOfBuffer(
	data: Uint8Array, options?: GetMimeTypeOptionsNoStrict
): Promise< string >;

async function getMimeTypeOfBuffer(
	data: Uint8Array,
	options?: GetMimeTypeOptions
)
: Promise< string | undefined >
{
	const fileTypeData = await fileTypeFromBuffer( data );

	if ( fileTypeData )
		return fileTypeData.mime;

	const { filename, strict } = options ?? { };

	return ( filename ? mimeFromFilename( filename ) : undefined )
		?? ( strict ? undefined : octetStream );
}

export async function getMimeType(
	data: NodeJS.ReadableStream, options: GetMimeTypeOptionsStrict
): Promise< GetMimeTypeResultStrictWithStream >;
export async function getMimeType(
	data: NodeJS.ReadableStream, options?: GetMimeTypeOptionsNoStrict
): Promise< GetMimeTypeResultWithStream >;
export async function getMimeType(
	data: number | Uint8Array, options: GetMimeTypeOptionsStrict
): Promise< GetMimeTypeResultStrict >;
export async function getMimeType(
	data: number | Uint8Array, options?: GetMimeTypeOptionsNoStrict
): Promise< GetMimeTypeResult >;

export async function getMimeType(
	data: number | Uint8Array | NodeJS.ReadableStream,
	options?: GetMimeTypeOptions
)
: Promise<
	Partial<
		| GetMimeTypeResultStrictWithStream
		| GetMimeTypeResultWithStream
		| GetMimeTypeResultStrict
		| GetMimeTypeResult
	>
>
{
	const _options = options as GetMimeTypeOptionsNoStrict;

	if ( typeof data === 'number' )
		return {
			mime: await getMimeTypeOfFd( data, _options )
		};

	if ( data instanceof Uint8Array ) // Includes Node.js Buffer
		return {
			mime: await getMimeTypeOfBuffer( data, _options )
		};
	else
	{
		const { head, stream } = await streamHead(
			< NodeJS.ReadableStream >data,
			{ bytes: fileTypeBufferLength }
		);

		return {
			stream,
			mime: await (await getMimeType( head, _options )).mime,
		} as GetMimeTypeResultWithStream;
	}
}

async function getMimeTypeOfFd(
	fd: number, options?: GetMimeTypeOptionsNoStrict
): Promise< string >;
async function getMimeTypeOfFd(
	fd: number, options?: GetMimeTypeOptionsStrict
): Promise< string | undefined >;

async function getMimeTypeOfFd(
	fd: number,
	options?: GetMimeTypeOptions
)
: Promise< string | undefined >
{
	const buffer = Buffer.allocUnsafe( fileTypeBufferLength );

	const { bytesRead } =
		await fsRead( fd, buffer, 0, fileTypeBufferLength, 0 );
//console.log("SS", bytesRead)
	if ( !bytesRead )
		return mimeFromFilename( options?.filename ) ??
			( options?.strict ? undefined : octetStream );

	if ( bytesRead < fileTypeBufferLength )
		buffer.fill( 0, bytesRead, fileTypeBufferLength - bytesRead );

	return getMimeTypeOfBuffer(
		buffer,
		options as GetMimeTypeOptionsNoStrict
	);
}
