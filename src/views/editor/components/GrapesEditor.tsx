import StudioEditor from '@grapesjs/studio-sdk/react';
import '@grapesjs/studio-sdk/style';
import { useAppContext } from '../../../contexts/AppContext';
import { useEffect, useRef, useState } from 'react';
import { useWebSocketContext } from '../../../contexts/WebSocketContext';

// ...
const GrapesEditor = () => {
    const { setEditor, currentProject } = useAppContext();
    const socket = useWebSocketContext();
    const isApplyingRemoteUpdate = useRef(false);
    const { editor } = useAppContext();
    const pendingUpdates = useRef<{[id: string]: ReturnType<typeof setTimeout>}>({});
    const lastOperationId = useRef<string | null>(null);
    const currentPageIndex = useRef<number>(0);
    const initialSyncDone = useRef<boolean>(false);
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        console.log('init', currentProject, setIsUpdating)
        if (currentProject){
            setIsUpdating(true)
        }
    },[])
    
    // Generar un ID único para cada operación
    const generateOperationId = () => {
        return Date.now().toString() + Math.random().toString(36).substring(2, 9);
    };

    const handleEditorReady = (editorInstance: any) => {
        console.log("iniciando editor")
        //if (sessionStorage.getItem('currentProject') !== null)
            console.log("nuevo proyecto guardado")
            setEditor(editorInstance);
            setTimeout(() => {
                if (socket?.sendMessage) {
                    // Enviar una solicitud de sincronización
                    const opId = generateOperationId();
                    lastOperationId.current = opId;
                    
                    socket.sendMessage(JSON.stringify({
                        type: "editor-update",
                        data: {
                            action: "sync-request",
                            operationId: opId
                        }
                    }));
                    
                    // También enviar el estado inicial
                    sendFullSync();
                }
            }, 1000);

            // Realizar sincronización inicial una vez que el editor esté listo
            setTimeout(() => {
                initialSyncRequest();
            }, 1000);

            // Cuando se cambia de página
            editorInstance.on('page:select', (page: any) => {
                if (isApplyingRemoteUpdate.current) return;
                
                // Obtener el índice de la página actual
                const pageIndex = editorInstance.Pages.getAll().indexOf(page);
                currentPageIndex.current = pageIndex;
                
                const opId = generateOperationId();
                lastOperationId.current = opId;
                
                // Notificar a otros usuarios sobre el cambio de página
                if (socket?.sendMessage) {
                    console.log("Cambio de página:", pageIndex);
                    socket.sendMessage(JSON.stringify({
                        type: "editor-update",
                        data: {
                            action: "page-change",
                            pageIndex: pageIndex,
                            operationId: opId
                        }
                    }));
                }
            });

            // Cuando se añade un componente
            editorInstance.on('component:add', (component: any) => {
                if (isApplyingRemoteUpdate.current) return;
                
                // Verificar si es un componente principal
                const parent = component.parent();
                if (!parent || parent.get('type') === 'wrapper') {
                    const opId = generateOperationId();
                    lastOperationId.current = opId;
                    
                    if (socket?.sendMessage) {
                        console.log("Enviando nuevo componente:", component.get('id'));
                        socket.sendMessage(JSON.stringify({
                            type: "editor-update",
                            data: {
                                action: "add-component",
                                component: component.toJSON(),
                                parentId: parent ? parent.get('id') : null,
                                pageIndex: currentPageIndex.current,
                                operationId: opId
                            }
                        }));
                    }
                }
            });

            // Cuando se elimina un componente
            editorInstance.on('component:remove', (component: any) => {
                if (isApplyingRemoteUpdate.current) return;
                
                const opId = generateOperationId();
                lastOperationId.current = opId;
                
                if (socket?.sendMessage) {
                    console.log("Enviando eliminación de componente:", component.get('id'));
                    socket.sendMessage(JSON.stringify({
                        type: "editor-update",
                        data: {
                            action: "remove-component",
                            componentId: component.get('id'),
                            pageIndex: currentPageIndex.current,
                            operationId: opId
                        }
                    }));
                }
            });
    
            // Para actualizaciones de componentes
            editorInstance.on('component:update', debounce((component: any) => {
                if (isApplyingRemoteUpdate.current) return;
                
                const opId = generateOperationId();
                lastOperationId.current = opId;
                
                if (socket?.sendMessage) {
                    console.log("Enviando actualización de componente:", component.get('id'));
                    socket.sendMessage(JSON.stringify({
                        type: "editor-update",
                        data: {
                            action: "update-component",
                            componentId: component.get('id'),
                            attributes: component.getAttributes(),
                            styles: component.getStyle(),
                            content: component.get('content'),
                            pageIndex: currentPageIndex.current,
                            operationId: opId
                        }
                    }));
                }
            }, 100));

            // Para cambios de posición
            editorInstance.on('component:drag:end', (component: any) => {
                if (isApplyingRemoteUpdate.current) return;
                
                const opId = generateOperationId();
                lastOperationId.current = opId;
                
                if (socket?.sendMessage) {
                    const parent = component.parent();
                    const index = parent ? parent.components().indexOf(component) : -1;
                    
                    console.log("Enviando reposicionamiento de componente:", component.get('id'));
                    socket.sendMessage(JSON.stringify({
                        type: "editor-update",
                        data: {
                            action: "move-component",
                            componentId: component.get('id'),
                            parentId: parent ? parent.get('id') : null,
                            index: index,
                            pageIndex: currentPageIndex.current,
                            operationId: opId
                        }
                    }));
                }
            });

            // Cuando se añade una nueva página
            editorInstance.on('page:add', (page: any) => {
                if (isApplyingRemoteUpdate.current) return;
                
                const opId = generateOperationId();
                lastOperationId.current = opId;
                
                if (socket?.sendMessage) {
                    const pageIndex = editorInstance.Pages.getAll().indexOf(page);
                    console.log("Nueva página añadida:", page.get('name'), "en índice:", pageIndex);
                    
                    socket.sendMessage(JSON.stringify({
                        type: "editor-update",
                        data: {
                            action: "page-add",
                            page: {
                                id: page.get('id'),
                                name: page.get('name'),
                                component: page.getMainComponent().toJSON()
                            },
                            index: pageIndex,
                            operationId: opId
                        }
                    }));
                }
            });

            // Cuando se elimina una página
            editorInstance.on('page:remove', (page: any) => {
                if (isApplyingRemoteUpdate.current) return;
                
                const opId = generateOperationId();
                lastOperationId.current = opId;
                
                if (socket?.sendMessage) {
                    console.log("Página eliminada:", page.get('id'));
                    
                    socket.sendMessage(JSON.stringify({
                        type: "editor-update",
                        data: {
                            action: "page-remove",
                            pageId: page.get('id'),
                            operationId: opId
                        }
                    }));
                }
            });
    };

    // Solicitar sincronización inicial al conectarse
    const initialSyncRequest = () => {
        if (!socket?.sendMessage || !editor || initialSyncDone.current) return;
        
        const opId = generateOperationId();
        lastOperationId.current = opId;
        
        console.log("Solicitando sincronización inicial");
        socket.sendMessage(JSON.stringify({
            type: "editor-update",
            data: {
                action: "sync-request",
                operationId: opId
            }
        }));
    };

    // Enviar sincronización completa cuando se solicita
    const sendFullSync = () => {
        if (!socket?.sendMessage || !editor) return;
        
        const opId = generateOperationId();
        lastOperationId.current = opId;
        
        try {
            // Recopilar información de todas las páginas
            const pages = editor.Pages!.getAll().map((page: any) => {
                return {
                    id: page.get('id'),
                    name: page.get('name'),
                    component: page.getMainComponent().toJSON()
                };
            });
            
            // Obtener el índice de la página actual
            const activePage = editor.Pages!.getSelected();
            const activePageIndex = activePage ? editor.Pages!.getAll().indexOf(activePage) : 0;
            
            console.log("Enviando sincronización completa con", pages.length, "páginas");
            socket.sendMessage(JSON.stringify({
                type: "editor-update",
                data: {
                    action: "full-sync",
                    pages: pages,
                    activePageIndex: activePageIndex,
                    operationId: opId
                }
            }));
        } catch (error) {
            console.error("Error al enviar sincronización completa:", error);
        }
    };

    // Función de debounce
    function debounce(func: Function, wait: number) {
        let timeout: ReturnType<typeof setTimeout> | null = null;
        return function(...args: any[]) {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                func(...args);
                timeout = null;
            }, wait);
        };
    }

    // Procesar actualizaciones recibidas
    useEffect(() => {
        if (!socket?.onEditorUpdate) return;
        if (!editor) return;
        
        const processedOperations = new Set<string>();
        
        socket.onEditorUpdate((update) => {
            if (!update || !editor) return;
            
            console.log("Recibida actualización:", update.action);
            
            // Evitar procesar operaciones duplicadas
            if (update.operationId) {
                if (processedOperations.has(update.operationId)) {
                    return;
                }
                processedOperations.add(update.operationId);
                setTimeout(() => processedOperations.delete(update.operationId), 5000);
            }

            // Evitar procesar operaciones propias
            if (update.operationId === lastOperationId.current) {
                return;
            }

            isApplyingRemoteUpdate.current = true;
            
            try {
                switch (update.action) {
                    case "sync-request":
                        // Responder con una sincronización completa
                        setTimeout(() => sendFullSync(), 200);
                        break;
                        
                    case "full-sync":
                        // Aplicar sincronización completa
                        console.log("Aplicando sincronización completa de", update.pages?.length, "páginas");
                        
                        // Borrar páginas existentes
                        while (editor.Pages1.getAll().length > 0) {
                            editor.Pages!.remove(editor.Pages!.getAll()[0]);
                        }
                        
                        // Añadir las páginas recibidas
                        if (update.pages && Array.isArray(update.pages)) {
                            update.pages.forEach((page: any) => {
                                editor.Pages!.add({
                                    id: page.id,
                                    name: page.name,
                                    component: page.component
                                });
                            });
                            
                            // Seleccionar la página activa
                            if (typeof update.activePageIndex === 'number' && update.activePageIndex >= 0) {
                                const pages = editor.Pages!.getAll();
                                if (pages[update.activePageIndex]) {
                                    editor.Pages!.select(pages[update.activePageIndex]);
                                    currentPageIndex.current = update.activePageIndex;
                                }
                            }
                        }
                        
                        initialSyncDone.current = true;
                        break;
                        
                    case "page-change":
                        // Cambiar a la página indicada
                        if (typeof update.pageIndex === 'number') {
                            const pages = editor.Pages!.getAll();
                            if (pages[update.pageIndex]) {
                                editor.Pages!.select(pages[update.pageIndex]);
                                currentPageIndex.current = update.pageIndex;
                            }
                        }
                        break;
                        
                    case "page-add":
                        // Añadir nueva página
                        if (update.page) {
                            editor.Pages!.add({
                                id: update.page.id,
                                name: update.page.name,
                                component: update.page.component
                            }, { at: update.index });
                        }
                        break;
                        
                    case "page-remove":
                        // Eliminar página
                        if (update.pageId) {
                            const pageToRemove = editor.Pages!.getAll().find((p: any) => p.get('id') === update.pageId);
                            if (pageToRemove) {
                                editor.Pages!.remove(pageToRemove);
                            }
                        }
                        break;
                        
                    case "add-component":
                        // Verificar si la actualización es para la página actual
                        if (update.pageIndex === currentPageIndex.current) {
                            const parent = update.parentId 
                                ? editor.getWrapper().find(`#${update.parentId}`)[0] 
                                : editor.getWrapper();
                            
                            if (parent) {
                                // Verificar si ya existe para evitar duplicados
                                const existingComp = editor.getWrapper().find(`#${update.component.id}`)[0];
                                if (!existingComp) {
                                    parent.append(update.component);
                                }
                            }
                        } else {
                            console.log("Ignorando componente para otra página:", update.pageIndex);
                        }
                        break;
                        
                    case "remove-component":
                        // Solo eliminar si estamos en la misma página
                        if (update.pageIndex === currentPageIndex.current) {
                            const compToRemove = editor.getWrapper().find(`#${update.componentId}`)[0];
                            if (compToRemove) {
                                compToRemove.remove();
                            }
                        }
                        break;
                        
                    case "update-component":
                        // Solo actualizar si estamos en la misma página
                        if (update.pageIndex === currentPageIndex.current) {
                            const compToUpdate = editor.getWrapper().find(`#${update.componentId}`)[0];
                            if (compToUpdate) {
                                if (update.attributes) compToUpdate.setAttributes(update.attributes);
                                if (update.styles) compToUpdate.setStyle(update.styles);
                                if (update.content) compToUpdate.set('content', update.content);
                            }
                        }
                        break;
                        
                    case "move-component":
                        // Solo mover si estamos en la misma página
                        if (update.pageIndex === currentPageIndex.current) {
                            const compToMove = editor.getWrapper().find(`#${update.componentId}`)[0];
                            const newParent = update.parentId 
                                ? editor.getWrapper().find(`#${update.parentId}`)[0]
                                : editor.getWrapper();
                                
                            if (compToMove && newParent) {
                                compToMove.remove();
                                newParent.append(compToMove, { at: update.index });
                            }
                        }
                        break;
                }
            } catch (error) {
                console.error("Error al aplicar actualización remota:", error);
            } finally {
                isApplyingRemoteUpdate.current = false;
            }
        });
        
    }, [socket, editor]);

    // Verificar periódicamente si se necesita sincronización
    useEffect(() => {
        if (!editor || !socket) return;
        
        const syncCheckInterval = setInterval(() => {
            if (!initialSyncDone.current) {
                initialSyncRequest();
            }
        }, 10000);
        
        return () => clearInterval(syncCheckInterval);
    }, [editor, socket]);

    return (
        <>
            <StudioEditor
                options={{
                    // ...
                    licenseKey: 'TU_CLAVE_DE_LICENCIA', 
                    project: {
                        type: 'web',
                        default: {
                            pages: isUpdating ? [] : [ 
                                { name: 'Home', component: '<h1>Home page</h1>' },
                                { name: 'About', component: '<h1>About page</h1>' },
                                { name: 'Contact', component: '<h1>Contact page</h1>' },
                            ] 
                        },
                    },
                    onReady: handleEditorReady,
                }}
            />
            {/* <button 
                onClick={sendFullSync}
                style={{ 
                    position: 'fixed', 
                    bottom: '20px', 
                    right: '20px',
                    padding: '10px 15px',
                    background: '#4a90e2', 
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Forzar Sincronización
            </button> */}
        </>
    );
};

export default GrapesEditor;