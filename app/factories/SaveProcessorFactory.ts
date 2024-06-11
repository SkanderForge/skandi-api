import EU4SaveProcessorService from "#services/savefile_processors/eu4_save_processor_service";
import {EU4Save, SaveData} from "../types/index.js";
import {inject} from "@adonisjs/core";
@inject()
export class SaveProcessorFactory {

  constructor(protected eu4SaveProcessorService: EU4SaveProcessorService) {
  }

  create(extension:string, res: SaveData | Record<string,unknown>):EU4SaveProcessorService | false{
    switch(extension){
      case "eu4":
        return this.eu4SaveProcessorService.setSave(res as EU4Save)
      case "vic3":
        break;
    }
    return false
  }
}
