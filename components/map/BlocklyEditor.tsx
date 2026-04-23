import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';


interface Props {
  toolboxConfig: any;
  onCodeChange: (code: string) => void;
}

export default function BlocklyEditor({ toolboxConfig, onCodeChange }: Props) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <script src="https://unpkg.com/blockly/blockly.min.js"></script>
        <style>
          html, body { 
            margin: 0; padding: 0; width: 100%; height: 100%; 
            background-color: #ffffff; overflow: hidden; 
          }
          #blocklyDiv { width: 100vw; height: 100vh; }

          /* FONDO DE REJILLA (DOT GRID) */
          .blocklySvg {
            background-image: radial-gradient(#E5E5E5 1.5px, transparent 1.5px);
            background-size: 30px 30px;
            background-color: #ffffff;
          }

          /* ESTILO BANCO DE BLOQUES ABAJO */
          .blocklyFlyoutBackground {
            fill: #F7F7F7 !important;
            fill-opacity: 1;
            stroke: #E5E5E5;
            stroke-width: 2px;
          }

          /* BLOQUES ESTILO FLAT (SIN BORDES NEGROS) */
          .blocklyPath { stroke-width: 0; }

          /* OCULTAR ELEMENTOS INNECESARIOS */
          .blocklyScrollbarHorizontal, 
          .blocklyScrollbarVertical,
          .blocklyTrash, 
          .blocklyZoom { display: none !important; }

          /* ─── PAPELERA (DROP ZONE FIJA) ────────────────── */
          #trashZone {
            position: fixed;
            bottom: 90px;
            right: 16px;
            width: 56px;
            height: 56px;
            border-radius: 28px;
            background: linear-gradient(135deg, #FF4B4B, #CC3C3C);
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 4px 12px rgba(255, 75, 75, 0.4);
            z-index: 9999;
            user-select: none;
            -webkit-user-select: none;
            pointer-events: none;
            transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
          }
          #trashZone svg {
            width: 24px;
            height: 24px;
            pointer-events: none;
            transition: transform 0.25s ease;
          }

          /* Cuando un bloque se arrastra sobre la papelera */
          #trashZone.active {
            transform: scale(1.35);
            box-shadow: 0 0 30px rgba(255, 75, 75, 0.8);
            background: linear-gradient(135deg, #FF1A1A, #CC0000);
          }
          #trashZone.active svg {
            transform: rotate(-15deg) scale(1.1);
          }

          /* Pulso suave en reposo */
          @keyframes trashPulse {
            0%, 100% { box-shadow: 0 4px 12px rgba(255, 75, 75, 0.4); }
            50% { box-shadow: 0 4px 20px rgba(255, 75, 75, 0.7); }
          }
          #trashZone:not(.active) {
            animation: trashPulse 3s ease-in-out infinite;
          }

          /* Flash de confirmación al borrar */
          @keyframes trashFlash {
            0% { transform: scale(1.35); background: #FF1A1A; }
            50% { transform: scale(1.5); background: #FFFFFF; }
            100% { transform: scale(1); background: linear-gradient(135deg, #FF4B4B, #CC3C3C); }
          }
          #trashZone.deleted {
            animation: trashFlash 0.4s ease-out forwards;
          }
        </style>
      </head>
      <body>
        <div id="blocklyDiv"></div>

        <!-- Papelera: zona de drop fija -->
        <div id="trashZone">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" 
                  stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
        </div>

        <script>
          window.onload = function() {
            const DuoTheme = Blockly.Theme.defineTheme('duo', {
              'base': Blockly.Themes.Classic,
              'blockStyles': {
                'logic_blocks': { 'colourPrimary': '#1CB0F6' },
                'math_blocks': { 'colourPrimary': '#58CC02' },
                'variable_blocks': { 'colourPrimary': '#FF9600' }
              },
              'componentStyles': {
                'workspaceBackgroundColour': 'transparent',
                'toolboxBackgroundColour': '#F7F7F7',
              }
            });

            const workspace = Blockly.inject('blocklyDiv', {
              toolbox: { "kind": "flyoutToolbox", "contents": ${JSON.stringify(toolboxConfig)} },
              toolboxPosition: 'bottom',
              horizontalLayout: true,
              theme: DuoTheme,
              trashcan: false,
              zoom: { startScale: 1.2 }
            });

            // ─── Eliminar menú intermedio de variables ─────────
            workspace.registerButtonCallback('CREATE_VARIABLE', function() {
              Blockly.Variables.createVariableButtonHandler(workspace);
            });

            const origShowEditor = Blockly.FieldVariable.prototype.showEditor_;
            Blockly.FieldVariable.prototype.showEditor_ = function() {
              const variable = this.getVariable();
              if (!variable) {
                origShowEditor.call(this);
                return;
              }
              const oldName = variable.name;
              const promptText = 'Renombrar variable "' + oldName + '" a:';
              Blockly.Variables.promptName(promptText, oldName, function(newName) {
                if (newName) {
                  workspace.renameVariableById(variable.getId(), newName);
                }
              });
            };

            // ─── PAPELERA: LÓGICA DE DROP ZONE ─────────────────
            const trashZone = document.getElementById('trashZone');
            let currentDragBlockId = null;
            let dragCheckInterval = null;
            let isOverTrash = false;

            // Detecta si un bloque SVG (que Blockly está arrastrando) 
            // colisiona con la zona de la papelera
            function checkBlockOverTrash() {
              const trashRect = trashZone.getBoundingClientRect();
              // Expandimos un poco el área de detección para que sea más fácil acertar
              const padding = 15;
              const expandedTrash = {
                left: trashRect.left - padding,
                right: trashRect.right + padding,
                top: trashRect.top - padding,
                bottom: trashRect.bottom + padding,
              };

              // Buscar el bloque que se está arrastrando en la drag surface
              const dragSurface = document.querySelector('.blocklyBlockDragSurface');
              if (!dragSurface) return false;

              const draggedBlocks = dragSurface.querySelectorAll('.blocklyDraggable');
              if (draggedBlocks.length === 0) return false;

              // Usar el bounding rect del bloque arrastrado
              const blockRect = draggedBlocks[0].getBoundingClientRect();
              
              // Verificar colisión entre el bloque y la papelera
              const overlaps = !(
                blockRect.right < expandedTrash.left ||
                blockRect.left > expandedTrash.right ||
                blockRect.bottom < expandedTrash.top ||
                blockRect.top > expandedTrash.bottom
              );

              return overlaps;
            }

            // Escuchar TODOS los eventos de Blockly para capturar el ciclo de drag
            workspace.addChangeListener(function(event) {

              // Un bloque comenzó a ser arrastrado
              if (event.type === Blockly.Events.BLOCK_DRAG && event.isStart) {
                currentDragBlockId = event.blockId;
                isOverTrash = false;

                // Iniciar verificación periódica de colisión (cada 80ms)
                dragCheckInterval = setInterval(function() {
                  const over = checkBlockOverTrash();
                  if (over && !isOverTrash) {
                    trashZone.classList.add('active');
                    isOverTrash = true;
                  } else if (!over && isOverTrash) {
                    trashZone.classList.remove('active');
                    isOverTrash = false;
                  }
                }, 80);
              }

              // Un bloque terminó de ser arrastrado (se soltó)
              if (event.type === Blockly.Events.BLOCK_DRAG && !event.isStart) {
                // Detener la verificación periódica
                if (dragCheckInterval) {
                  clearInterval(dragCheckInterval);
                  dragCheckInterval = null;
                }

                // Si el bloque se soltó sobre la papelera, eliminarlo
                if (isOverTrash && currentDragBlockId) {
                  const block = workspace.getBlockById(currentDragBlockId);
                  if (block) {
                    // Flash de confirmación visual
                    trashZone.classList.remove('active');
                    trashZone.classList.add('deleted');
                    setTimeout(function() {
                      trashZone.classList.remove('deleted');
                    }, 400);

                    // Eliminar el bloque
                    block.dispose(true, true);
                  }
                } else {
                  trashZone.classList.remove('active');
                }

                currentDragBlockId = null;
                isOverTrash = false;
              }
            });

            // ─── Generadores seguros para bloques problemáticos ───
            // Envolvemos los generadores de bloques específicos en try/catch
            // para que nunca lancen errores, sin importar cómo se conecten.
            
            const safeWrapGenerator = function(blockType) {
              const original = Blockly.JavaScript[blockType];
              if (original) {
                Blockly.JavaScript[blockType] = function(block) {
                  try {
                    return original.call(this, block);
                  } catch (e) {
                    // Si el generador falla, retorna un string vacío seguro
                    return ['', Blockly.JavaScript.ORDER_NONE];
                  }
                };
              }
            };

            // Proteger los generadores más comunes
            safeWrapGenerator('math_number');
            safeWrapGenerator('variables_set');
            safeWrapGenerator('variables_get');
            safeWrapGenerator('math_arithmetic');
            safeWrapGenerator('text');
            safeWrapGenerator('text_print');
            safeWrapGenerator('logic_compare');

            // ─── Listener de cambios para el código ───
            workspace.addChangeListener(function(event) {
              // Solo actualizar código cuando cambia algo relevante
              if (event.type === Blockly.Events.BLOCK_MOVE ||
                  event.type === Blockly.Events.BLOCK_CHANGE ||
                  event.type === Blockly.Events.BLOCK_CREATE ||
                  event.type === Blockly.Events.BLOCK_DELETE) {
                try {
                  const code = Blockly.JavaScript.workspaceToCode(workspace);
                  window.ReactNativeWebView.postMessage(code || '');
                } catch (e) {
                  // Si la generación de código falla, enviar marcador de error
                  // para que ExerciseScreen sepa que hay un problema
                  window.ReactNativeWebView.postMessage('__INVALID_CODE__');
                }
              }
            });
          };
        </script>
      </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        onMessage={(event) => onCodeChange(event.nativeEvent.data)}
        javaScriptEnabled={true}
        style={{ flex: 1 }}
        scrollEnabled={false}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={{ position: 'absolute', height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
            <ActivityIndicator size="large" color="#58CC02" />
          </View>
        )}
      />
    </View>
  );
}