import { getMimeType } from './index'

import { openSync, readFileSync, createReadStream } from 'fs'
import * as path from 'path'

import { buffer as getStreamAsBuffer } from 'get-stream'


const thisFile = __filename;
const pngFile = path.join( __dirname, '..', 'fixtures', '1x1.png' );
const emptyPngFile = path.join( __dirname, '..', 'fixtures', 'empty.png' );

const thisFd = openSync( thisFile, "r" );
const pngFd = openSync( pngFile, "r" );
const emptyPngFd = openSync( emptyPngFile, "r" );
const thisBuffer = readFileSync( thisFile, null );
const pngBuffer = readFileSync( pngFile, null );
const thisStream = ( ) => createReadStream( thisFile );
const pngStream = ( ) => createReadStream( pngFile );

describe( "typescript as fd", ( ) =>
{
	it( "strict, no filename", async ( ) =>
	{
		const { mime } = await getMimeType( thisFd, { strict: true } );
		expect( mime ).toBeUndefined( );
	} );

	it( "strict, filename", async ( ) =>
	{
		const { mime } = await getMimeType( thisFd, {
			strict: true,
			filename: 'file.ts'
		} );
		expect( mime ).toBe( "video/mp2t" );
	} );

	it( "strict, no filename", async ( ) =>
	{
		const { mime } = await getMimeType( thisFd, { strict: false } );
		expect( mime ).toBe( 'application/octet-stream' );
	} );

	it( "strict, filename", async ( ) =>
	{
		const { mime } = await getMimeType( thisFd, {
			strict: false,
			filename: 'file.ts'
		} );
		expect( mime ).toBe( 'video/mp2t' );
	} );
} );

describe( "png as fd", ( ) =>
{
	it( "strict, no filename", async ( ) =>
	{
		const { mime } = await getMimeType( pngFd, { strict: true } );
		expect( mime ).toBe( 'image/png' );
	} );

	it( "strict, filename", async ( ) =>
	{
		const { mime } = await getMimeType( pngFd, {
			strict: true,
			filename: 'file.png'
		} );
		expect( mime ).toBe( "image/png" );
	} );

	it( "strict, no filename", async ( ) =>
	{
		const { mime } = await getMimeType( pngFd, { strict: false } );
		expect( mime ).toBe( 'image/png' );
	} );

	it( "strict, filename", async ( ) =>
	{
		const { mime } = await getMimeType( pngFd, {
			strict: false,
			filename: 'file.png'
		} );
		expect( mime ).toBe( 'image/png' );
	} );
} );

describe( "empty png as fd", ( ) =>
{
	it( "strict, no filename", async ( ) =>
	{
		const { mime } = await getMimeType( emptyPngFd, { strict: true } );
		expect( mime ).toBeUndefined( );
	} );

	it( "strict, filename", async ( ) =>
	{
		const { mime } = await getMimeType( emptyPngFd, {
			strict: true,
			filename: 'file.png'
		} );
		expect( mime ).toBe( "image/png" );
	} );

	it( "strict, no filename", async ( ) =>
	{
		const { mime } = await getMimeType( emptyPngFd, { strict: false } );
		expect( mime ).toBe( 'application/octet-stream' );
	} );

	it( "strict, filename", async ( ) =>
	{
		const { mime } = await getMimeType( emptyPngFd, {
			strict: false,
			filename: 'file.png'
		} );
		expect( mime ).toBe( 'image/png' );
	} );
} );

describe( "typescript as buffer", ( ) =>
{
	it( "strict, no filename", async ( ) =>
	{
		const { mime } = await getMimeType( thisBuffer, { strict: true } );
		expect( mime ).toBeUndefined( );
	} );

	it( "strict, filename", async ( ) =>
	{
		const { mime } = await getMimeType( thisBuffer, {
			strict: true,
			filename: 'file.ts'
		} );
		expect( mime ).toBe( "video/mp2t" );
	} );

	it( "strict, no filename", async ( ) =>
	{
		const { mime } = await getMimeType( thisBuffer, { strict: false } );
		expect( mime ).toBe( 'application/octet-stream' );
	} );

	it( "strict, filename", async ( ) =>
	{
		const { mime } = await getMimeType( thisBuffer, {
			strict: false,
			filename: 'file.ts'
		} );
		expect( mime ).toBe( 'video/mp2t' );
	} );
} );

describe( "png as buffer", ( ) =>
{
	it( "strict, no filename", async ( ) =>
	{
		const { mime } = await getMimeType( pngBuffer, { strict: true } );
		expect( mime ).toBe( "image/png" );
	} );

	it( "strict, filename", async ( ) =>
	{
		const { mime } = await getMimeType( pngBuffer, {
			strict: true,
			filename: 'file.ts'
		} );
		expect( mime ).toBe( "image/png" );
	} );

	it( "strict, no filename", async ( ) =>
	{
		const { mime } = await getMimeType( pngBuffer, { strict: false } );
		expect( mime ).toBe( 'image/png' );
	} );

	it( "strict, filename", async ( ) =>
	{
		const { mime } = await getMimeType( pngBuffer, {
			strict: false,
			filename: 'file.ts'
		} );
		expect( mime ).toBe( 'image/png' );
	} );
} );

describe( "typescript as stream", ( ) =>
{
	it( "strict, no filename", async ( ) =>
	{
		const { mime, stream } =
			await getMimeType( thisStream( ), { strict: true } );
		expect( mime ).toBeUndefined( );
		expect( await getStreamAsBuffer( stream ) ).toEqual( thisBuffer );
	} );

	it( "strict, filename", async ( ) =>
	{
		const { mime, stream } =
			await getMimeType( thisStream( ), {
				strict: true,
				filename: 'file.ts'
			} );
		expect( mime ).toBe( "video/mp2t" );
		expect( await getStreamAsBuffer( stream ) ).toEqual( thisBuffer );
	} );

	it( "strict, no filename", async ( ) =>
	{
		const { mime, stream } =
			await getMimeType( thisStream( ), { strict: false } );
		expect( mime ).toBe( 'application/octet-stream' );
		expect( await getStreamAsBuffer( stream ) ).toEqual( thisBuffer );
	} );

	it( "strict, filename", async ( ) =>
	{
		const { mime, stream } =
			await getMimeType( thisStream( ), {
				strict: false,
				filename: 'file.ts'
			} );
		expect( mime ).toBe( 'video/mp2t' );
		expect( await getStreamAsBuffer( stream ) ).toEqual( thisBuffer );
	} );
} );

describe( "png as stream", ( ) =>
{
	it( "strict, no filename", async ( ) =>
	{
		const { mime, stream } =
			await getMimeType( pngStream( ), { strict: true } );
		expect( mime ).toBe( "image/png" );
		expect( await getStreamAsBuffer( stream ) ).toEqual( pngBuffer );
	} );

	it( "strict, filename", async ( ) =>
	{
		const { mime, stream } =
			await getMimeType( pngStream( ), {
				strict: true,
				filename: 'file.ts'
			} );
		expect( mime ).toBe( "image/png" );
		expect( await getStreamAsBuffer( stream ) ).toEqual( pngBuffer );
	} );

	it( "strict, no filename", async ( ) =>
	{
		const { mime, stream } =
			await getMimeType( pngStream( ), { strict: false } );
		expect( mime ).toBe( 'image/png' );
		expect( await getStreamAsBuffer( stream ) ).toEqual( pngBuffer );
	} );

	it( "strict, filename", async ( ) =>
	{
		const { mime, stream } =
			await getMimeType( pngStream( ), {
				strict: false,
				filename: 'file.ts'
			} );
		expect( mime ).toBe( 'image/png' );
		expect( await getStreamAsBuffer( stream ) ).toEqual( pngBuffer );
	} );
} );
