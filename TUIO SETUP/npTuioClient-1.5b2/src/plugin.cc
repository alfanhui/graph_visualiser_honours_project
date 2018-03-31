//
// Copyright (C) 2009-2012  Fajran Iman Rusadi
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//

#include "plugin.h"

#include <string>
#include <stdlib.h>
#include <string.h>

#include "../npapi/npapi.h"
#include "../npapi/npfunctions.h"

#include "debug.h"

#include "connection-manager.h"
#include "adapter-npapi.h"

#define PLUGIN_NAME             "TUIO Client"
#define MIME_TYPES_HANDLED      "application/x-tuio"
#define MIME_TYPES_DESCRIPTION  MIME_TYPES_HANDLED":tuio:"PLUGIN_NAME
#define PLUGIN_DESCRIPTION      "TUIO Client plugin"
#define PLUGIN_VERSION          "1.5b2"

#define DEFAULT_PORT      3333
#define DEFAULT_CALLBACK  "tuio_callback"

static NPNetscapeFuncs browser;

static ConnectionManager* connection_manager = NULL;

static ConnectionManager* get_connection_manager() {
  D("get_connection_manager => %p", connection_manager);
  if (connection_manager == NULL) {
    connection_manager = new ConnectionManager();
    D("new ConnectionManager(): %p", connection_manager);
  }
  return connection_manager;
}

static void fill_netscape_functions(NPNetscapeFuncs* srcFuncs,
                                    NPNetscapeFuncs* dstFuncs) {
  // Taken and adapted from FireBreath

  dstFuncs->size = srcFuncs->size;
  dstFuncs->version = srcFuncs->version;
  dstFuncs->geturl = srcFuncs->geturl;
  dstFuncs->posturl = srcFuncs->posturl;
  dstFuncs->requestread = srcFuncs->requestread;
  dstFuncs->newstream = srcFuncs->newstream;
  dstFuncs->write = srcFuncs->write;
  dstFuncs->destroystream = srcFuncs->destroystream;
  dstFuncs->status = srcFuncs->status;
  dstFuncs->uagent = srcFuncs->uagent;
  dstFuncs->memalloc = srcFuncs->memalloc;
  dstFuncs->memfree = srcFuncs->memfree;
  dstFuncs->memflush = srcFuncs->memflush;
  dstFuncs->reloadplugins = srcFuncs->reloadplugins;
  dstFuncs->geturlnotify = srcFuncs->geturlnotify;
  dstFuncs->posturlnotify = srcFuncs->posturlnotify;
  dstFuncs->getvalue = srcFuncs->getvalue;
  dstFuncs->setvalue = srcFuncs->setvalue;
  dstFuncs->invalidaterect = srcFuncs->invalidaterect;
  dstFuncs->invalidateregion = srcFuncs->invalidateregion;
  dstFuncs->forceredraw = srcFuncs->forceredraw;
  dstFuncs->getstringidentifier = srcFuncs->getstringidentifier;
  dstFuncs->getstringidentifiers = srcFuncs->getstringidentifiers;
  dstFuncs->getintidentifier = srcFuncs->getintidentifier;
  dstFuncs->identifierisstring = srcFuncs->identifierisstring;
  dstFuncs->utf8fromidentifier = srcFuncs->utf8fromidentifier;
  dstFuncs->intfromidentifier = srcFuncs->intfromidentifier;
  dstFuncs->createobject = srcFuncs->createobject;
  dstFuncs->retainobject = srcFuncs->retainobject;
  dstFuncs->releaseobject = srcFuncs->releaseobject;
  dstFuncs->invoke = srcFuncs->invoke;
  dstFuncs->invokeDefault = srcFuncs->invokeDefault;
  dstFuncs->evaluate = srcFuncs->evaluate;
  dstFuncs->getproperty = srcFuncs->getproperty;
  dstFuncs->setproperty = srcFuncs->setproperty;
  dstFuncs->removeproperty = srcFuncs->removeproperty;
  dstFuncs->hasproperty = srcFuncs->hasproperty;
  dstFuncs->hasmethod = srcFuncs->hasmethod;
  dstFuncs->releasevariantvalue = srcFuncs->releasevariantvalue;
  dstFuncs->setexception = srcFuncs->setexception;
  dstFuncs->construct = srcFuncs->construct;

  if (srcFuncs->version >= NPVERS_MACOSX_HAS_COCOA_EVENTS) { // 23
    dstFuncs->scheduletimer = srcFuncs->scheduletimer;
    dstFuncs->unscheduletimer = srcFuncs->unscheduletimer;
  }

  if (srcFuncs->version >= NPVERS_HAS_STREAMOUTPUT) { // 8
    // ?
  }
  if (srcFuncs->version >= NPVERS_HAS_NOTIFICATION) { // 9
    // ?
  }
  if (srcFuncs->version >= NPVERS_HAS_LIVECONNECT) { // 9
    // ?
  }
  if (srcFuncs->version >= NPVERS_68K_HAS_LIVECONNECT) { // 11
    // ?
  }
  if (srcFuncs->version >= NPVERS_HAS_WINDOWLESS) { // 11
    // ?
  }
  if (srcFuncs->version >= NPVERS_HAS_XPCONNECT_SCRIPTING) { // 13
    // ?
  }
  if (srcFuncs->version >= NPVERS_HAS_NPRUNTIME_SCRIPTING) { // 14
    // ?
  }
  if (srcFuncs->version >= NPVERS_HAS_FORM_VALUES) { // 15
    // ?
  }
  if (srcFuncs->version >= NPVERS_HAS_POPUPS_ENABLED_STATE) {
    dstFuncs->pushpopupsenabledstate = srcFuncs->pushpopupsenabledstate;
    dstFuncs->poppopupsenabledstate = srcFuncs->poppopupsenabledstate;
  }
  if (srcFuncs->version >= NPVERS_HAS_RESPONSE_HEADERS) { // 17
    // ?
  }
  if (srcFuncs->version >= NPVERS_HAS_NPOBJECT_ENUM) { // 18
    dstFuncs->enumerate = srcFuncs->enumerate;
  }
#ifndef XP_MACOSX
  // Mac OS X' version is taken care of separately
  if (srcFuncs->version >= NPVERS_HAS_PLUGIN_THREAD_ASYNC_CALL) { // 19
    dstFuncs->pluginthreadasynccall = srcFuncs->pluginthreadasynccall;
  }
#endif
  if (srcFuncs->version >= NPVERS_HAS_ALL_NETWORK_STREAMS) { // 20
    // ?
  }
  if (srcFuncs->version >= NPVERS_HAS_URL_AND_AUTH_INFO) { // 21
    dstFuncs->getvalueforurl = srcFuncs->getvalueforurl;
    dstFuncs->setvalueforurl = srcFuncs->setvalueforurl;
    dstFuncs->getauthenticationinfo = srcFuncs->getauthenticationinfo;
  }
}

static void fill_plugin_functions(NPPluginFuncs* pFuncs) {
  pFuncs->newp = NPP_New;
  pFuncs->destroy = NPP_Destroy;
  pFuncs->setwindow = NPP_SetWindow;
  pFuncs->newstream = NPP_NewStream;
  pFuncs->destroystream = NPP_DestroyStream;
  pFuncs->asfile = NPP_StreamAsFile;
  pFuncs->writeready = NPP_WriteReady;
  pFuncs->write = NPP_Write;
  pFuncs->print = NPP_Print;
  pFuncs->event = NPP_HandleEvent;
  pFuncs->urlnotify = NPP_URLNotify;
  pFuncs->getvalue = NPP_GetValue;
  pFuncs->setvalue = NPP_SetValue;
}

#ifdef XP_MACOSX
NP_EXPORT(NPError) NP_Initialize(NPNetscapeFuncs* bFuncs) {
  D("NP_Initialize");

  fill_netscape_functions(bFuncs, &browser);

  return NPERR_NO_ERROR;
}

NP_EXPORT(NPError) NP_GetEntryPoints(NPPluginFuncs* pFuncs) {
  D("NP_GetEntryPoints");

  fill_plugin_functions(pFuncs);

  return NPERR_NO_ERROR;
}
#else
NP_EXPORT(NPError) NP_Initialize(NPNetscapeFuncs* bFuncs,
                                 NPPluginFuncs* pFuncs) {
  D("NP_Initialize");

  fill_netscape_functions(bFuncs, &browser);
  fill_plugin_functions(pFuncs);

  return NPERR_NO_ERROR;
}
#endif

NP_EXPORT(char*) NP_GetPluginVersion() {
  return (char*)PLUGIN_VERSION;
}

NP_EXPORT(const char*) NP_GetMIMEDescription() {
  return MIME_TYPES_DESCRIPTION;
}

NP_EXPORT(NPError) NP_GetValue(void* future, NPPVariable variable,
                               void* value) {
  switch (variable) {
    case NPPVpluginNameString:
      *((char**)value) = (char*)PLUGIN_NAME;
      break;
    case NPPVpluginDescriptionString:
      *((char**)value) = (char*)PLUGIN_DESCRIPTION;
      break;
    case NPPVpluginNeedsXEmbed:
      *(int*)value = true;
      break;
    default:
      return NPERR_INVALID_PARAM;
      break;
  }
  return NPERR_NO_ERROR;
}

NP_EXPORT(NPError) NP_Shutdown() {
  D("NP_Shutdown");

  if (connection_manager) {
    delete connection_manager;
    connection_manager = NULL;
  }

  return NPERR_NO_ERROR;
}

NPError NPP_New(NPMIMEType pluginType, NPP instance, uint16_t mode,
                int16_t argc, char* argn[], char* argv[],
                NPSavedData* saved) {
  D("NPP_New");

  int port = DEFAULT_PORT;
  std::string callback(DEFAULT_CALLBACK);

  for (int i=0; i<argc; i++) {
    if (strcmp(argn[i], "port") == 0) {
      port = atoi(argv[i]);
    }
    else if (strcmp(argn[i], "callback") == 0) {
      callback = std::string(argv[i]);
    }
  }

  D("port: %d, callback: %s", port, callback.c_str());

  ConnectionManager* manager = get_connection_manager();

  Adapter* adapter = new NPAPIAdapter(&browser, instance, callback);
  adapter->Init();
  manager->Register(adapter, port);

  D("NPP_New: instance=%p manager=%p adapter=%p", instance, manager, adapter);

  instance->pdata = (void*)adapter;

#ifdef XP_MACOSX
  /* Select the Core Graphics drawing model. */
  NPBool supportsCoreGraphics = false;
  if (browser.getvalue(instance, NPNVsupportsCoreGraphicsBool,
                       &supportsCoreGraphics) == NPERR_NO_ERROR
                                                  && supportsCoreGraphics) {
    browser.setvalue(instance, NPPVpluginDrawingModel,
                     (void*)NPDrawingModelCoreGraphics);
  } else {
    printf("CoreGraphics drawing model not supported, "
           "can't create a plugin instance.\n");
    return NPERR_INCOMPATIBLE_VERSION_ERROR;
  }

  /* Select the Cocoa event model. */
  NPBool supportsCocoaEvents = false;
  if (browser.getvalue(instance, NPNVsupportsCocoaBool,
                       &supportsCocoaEvents) == NPERR_NO_ERROR
                                                 && supportsCocoaEvents) {
    browser.setvalue(instance, NPPVpluginEventModel, (void*)NPEventModelCocoa);
  } else {
    printf("Cocoa event model not supported, "
           "can't create a plugin instance.\n");
    return NPERR_INCOMPATIBLE_VERSION_ERROR;
  }
#endif


  // TODO instantiate instances
  //      if malloc fails, returns NPERR_OUT_OF_MEMORY_ERROR
  //      if error, returns NPERR_GENERIC_ERROR
  return NPERR_NO_ERROR;
}

NPError NPP_Destroy(NPP instance, NPSavedData** save) {
  D("NPP_Destroy");

  Adapter* adapter = (Adapter*)instance->pdata;
  
  ConnectionManager* manager = get_connection_manager();
  D("NPP_Destroy: instance=%p manager=%p adapter=%p", instance, manager, adapter);

  manager->Unregister(adapter);
  adapter->Destroy();

  D("NPP_Destroy OK");

  delete adapter;
  instance->pdata = NULL;

  return NPERR_NO_ERROR;
}

NPError NPP_SetWindow(NPP instance, NPWindow* window) {
  return NPERR_NO_ERROR;
}

NPError NPP_NewStream(NPP instance, NPMIMEType type, NPStream* stream,
                      NPBool seekable, uint16_t* stype) {
  return NPERR_GENERIC_ERROR;
}

NPError NPP_DestroyStream(NPP instance, NPStream* stream, NPReason reason) {
  return NPERR_GENERIC_ERROR;
}

int32_t NPP_WriteReady(NPP instance, NPStream* stream) {
  return 0;
}

int32_t NPP_Write(NPP instance, NPStream* stream, int32_t offset, int32_t len,
                  void* buffer) {
  return 0;
}

void NPP_StreamAsFile(NPP instance, NPStream* stream, const char* fname) {

}

void NPP_Print(NPP instance, NPPrint* platformPrint) {

}

int16_t NPP_HandleEvent(NPP instance, void* event) {
  return 0;
}

void NPP_URLNotify(NPP instance, const char* URL, NPReason reason,
                   void* notifyData) {
}

NPError NPP_GetValue(NPP instance, NPPVariable variable, void* value) {
  switch (variable) {
    case NPPVpluginNameString:
      *((char**)value) = (char*)PLUGIN_NAME;
      break;
    case NPPVpluginDescriptionString:
      *((char**)value) = (char*)PLUGIN_DESCRIPTION;
      break;
    case NPPVpluginNeedsXEmbed:
      *(int*)value = true;
      break;
    default:
      return NPERR_INVALID_PARAM;
      break;
  }
  return NPERR_NO_ERROR;
}

NPError NPP_SetValue(NPP instance, NPNVariable variable, void* value) {
  return NPERR_GENERIC_ERROR;
}

